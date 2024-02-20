import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';
import { SireneEntrepriseService } from 'src/sirene-entreprise/services/sirene-entreprise.service';
import { SireneEntrepriseEntity } from 'src/sirene-entreprise/entities/sirene-entreprise.entity';
import { parseStream } from 'fast-csv';

let fs = require("fs");

export type Position = {
    lat: number;
    long: number;
};

export type LocalisationRecherche = {
    pos: Position;
    departement: String;
}

@Injectable()
export class BanService {
    constructor(private readonly entrepriseService: EntrepriseService,
        private sireneEntrepriseService: SireneEntrepriseService,
    ) { }

    async updateSireneEntreprise() {
        fs.mkdir("temp/ban", { recursive: true }, () => { });

        console.log("Récupération des entreprises");
        let entreprises = await this.sireneEntrepriseService.findAllForBan();
        console.log("> Fin");

        let files = this.makeBanCsv(entreprises);
        entreprises.reverse();
        for (let file of files) {
            console.log(`Début fichier ${file}`);
            let path = require("path");
            file = path.resolve(".") + "/" + file;
            let newFile = path.resolve(".") + "/" + `temp/ban/res_${file.split('/').at(-1)}`;

            console.log(file, newFile);

            if (!fs.existsSync(newFile)) {
                console.log("> Téléchargement du ficher");
                require("child_process")
                    .execSync(`curl -X POST -F data=@${file} -F resut_columns=latitude -F result_colums=longitude https://api-adresse.data.gouv.fr/search/csv/ > ${newFile}`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(`error: ${err.message}`);
                            return;

                        }
                    })

                fs.unlink(file.toString(), () => { });
            }

            let csvStream = fs.createReadStream(newFile);

            let c = 0;
            parseStream(csvStream, { headers: true })
                .on('error', console.log)
                .on('data', row => {
                    let entreprise = entreprises.pop();

                    entreprise.latitude = row.latitude;
                    entreprise.longitude = row.longitude;

                    this.sireneEntrepriseService.update(entreprise);
                    if (c % 100000 == 0) {
                        console.log(c);
                    }
                    c += 1;
                })
                .on('end', _ => {
                    csvStream.close();
                    fs.unlink(csvStream.path, () => { });
                    console.log(`Fin fichier ${file}`);
                });
        }
    }

    private makeBanCsv(entreprises: SireneEntrepriseEntity[]): String[] {
        console.log("Création des fichiers de requête BAN");

        let paths = [];
        let chunck = 0;

        console.log(entreprises.length);

        let path = `temp/ban/chunck_${chunck}.csv`;
        let currentStream = fs.openSync(path, "w+");
        paths.push(path);
        fs.writeSync(currentStream, "nom,adresse,postcode,city\n");
        for (let entreprise of entreprises) {
            let line = `,"${entreprise.address}","${entreprise.postalCode}","${entreprise.city}"`;
            if (currentStream.bytesWritten + line.length >= 5e+7) {
                fs.close(currentStream);
                chunck++;
                path = `temp/ban/chunck_${chunck}.csv`;
                currentStream = fs.openSync(path, "w+");
                paths.push(path);
                fs.writeSync(currentStream, "nom,adresse,postcode,city\n");
            }

            fs.writeSync(currentStream, line + "\n");
        }

        fs.close(currentStream);

        return paths;
    }

    async findByAddress(address: String): Promise<LocalisationRecherche> {
        return axios
            .get(
                'https://api-adresse.data.gouv.fr/search/?q=' +
                address.replace(' ', '+'),
            )
            .then((res) => {
                let coordinates = res.data.features[0].geometry.coordinates;
                let departement = res.data.features[0].properties.postcode.slice(0, 2);
                console.log(res.data.features[0]);
                return { pos: { lat: coordinates[1], long: coordinates[0] }, departement: departement };
            });
    }

    async findByPosition(pos: Position): Promise<string> {
        return axios
            .get(
                'https://api-adresse.data.gouv.fr/reverse/?lon=' +
                pos.long +
                '&lat=' +
                pos.lat,
            )
            .then(
                (res) => {
                    return res.data.features[0].properties;
                },
                (e) => e,
            );
    }

    async findCompletedLocationByAddress(
        address: string,
    ): Promise<LocationEntrepriseEntity> {
        try {
            const res = await axios.get(
                `https://api-adresse.data.gouv.fr/search/?q=${address.replace(' ', '+')}&limit=1`,
            );

            const coordinates = res.data.features[0].geometry.coordinates;
            const context = res.data.features[0].properties.context;
            const postcode = res.data.features[0].properties.postcode;
            const street = res.data.features[0].properties.street;
            const city = res.data.features[0].properties.city;
            const contextParts = context.split(', ');

            return {
                streetAddress: street,
                postalCode: postcode,
                city: city,
                department: contextParts[1],
                departmentNumber: contextParts[0],
                region: contextParts[2],
                longitude: coordinates[0],
                latitude: coordinates[1],
                interventionZone: 'inconnue',
                country: 'France',
            } as LocationEntrepriseEntity;
        } catch (error) {
            console.error('Error fetching address:', error);
            return {} as LocationEntrepriseEntity;
        }
    }

    /**
     * @param {Position} pos - The center of the circle to search
     * @param {number} radius - The radius of the circle, in km
     *
     * @returns {Promise<EntrepriseEntity[]>} A promise of the list of entities inside the radius
     */
    async getInRadius(
        pos: LocalisationRecherche,
        radius: number,
    ): Promise<SireneEntrepriseEntity[]> {
        return this.sireneEntrepriseService
            .findAllInDepartement(pos.departement)
            .then((entreprises: SireneEntrepriseEntity[]) =>
                entreprises.filter(
                    (e: SireneEntrepriseEntity) => {
                        let distance = this.calcDistance(pos.pos, {
                            lat: e.latitude,
                            long: e.longitude,
                        });
                        return distance <= radius;
                    },
                ),
            );
    }

    /**
     * [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
     * @param {Position} pos1 - Position of the first location
     * @param {Position} pos2 - Position of the second location
     *
     * @returns {number} The distance between the two loactions, in km
     */
    private calcDistance(pos1: Position, pos2: Position): number {
        let lat1 = pos1.lat;
        let lat2 = pos2.lat;

        let lon1 = pos1.long;
        let lon2 = pos2.long;
        var R = 6371; // km
        var dLat = this.toRad(lat2 - lat1);
        var dLon = this.toRad(lon2 - lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    // Converts numeric degrees to radians
    private toRad(value) {
        return value * Math.PI / 180;
    }
}
