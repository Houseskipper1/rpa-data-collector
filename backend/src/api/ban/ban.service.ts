import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';
import { SireneEntrepriseService } from 'src/sirene-entreprise/services/sirene-entreprise.service';
import { SireneEntrepriseEntity } from 'src/sirene-entreprise/entities/sirene-entreprise.entity';
import { parse } from 'fast-csv';

let fs = require('fs');

export type Position = {
  lat: number;
  long: number;
};

export type LocalisationRecherche = {
  pos: Position;
  departement: string;
};

/**
 * This service is used to add localization to siren Entreprise and calculate neighbours
 */
@Injectable()
export class BanService {

  /**
   * 
   * @param entrepriseService Service for Entreprise
   * @param sireneEntrepriseService Service for sireneEntreprise
   */
  constructor(
    private readonly entrepriseService: EntrepriseService,
    private sireneEntrepriseService: SireneEntrepriseService,
  ) {}

  /**
   * update sireneEntreprises with theirs long and lat
   */
  async updateSireneEntreprise(): Promise<void> {
    fs.mkdir('temp/ban', { recursive: true }, () => {});

    console.log('Récupération des entreprises');
    let cursor = await this.sireneEntrepriseService.findAllForBan(true)
    let files = await this.makeBanCsv(cursor);
    cursor.rewind();
    console.log('Fin');
    for (let file of files) {
      console.log(`Début fichier ${file}`);
      let path = require('path');
      file = path.resolve('.') + '/' + file;
      let newFile =
        path.resolve('.') + '/' + `temp/ban/res_${file.split('/').at(-1)}`;

      console.log(file, newFile);

      if (!fs.existsSync(newFile)) {
        console.log('Téléchargement du fichier.');
        require('child_process').execSync(
          `curl -X POST -F data=@${file} -F resut_columns=latitude -F result_colums=longitude https://api-adresse.data.gouv.fr/search/csv/ > ${newFile}`,
          (err, stdout, stderr) => {
            if (err) {
              console.log(`error: ${err.message}`);
              return;
            }
          },
        );

        fs.unlink(file.toString(), () => {});
      }
      let csvStream = fs.createReadStream(newFile);
      let c = 0;

      const readStream = csvStream.pipe(parse({headers: true}))
      for await (let row of readStream){
        c += 1;
        let entreprise = await cursor.next()
        this.sireneEntrepriseService.update({"_id": entreprise._id}, {"latitude": row.latitude, "longitude": row.longitude})
        if (c % 100000 == 0) {
          console.log(c);
        }
      }
    }
    cursor.close()
    Promise.resolve();
  }

  /**
   * create X files < 50 Mb with datas needed for BAN Api
   * @param entreprises cursor of all sireneEntreprises collection
   * @returns {Promise<String[]>} all created path files
   */
  private async makeBanCsv(entreprises): Promise<String[]> {
    console.log('Création des fichiers de requête BAN');
    let paths = [];
    let chunk = 0;

    let path = `temp/ban/chunk_${chunk}.csv`;
    let currentStream = fs.createWriteStream(path)
    paths.push(path);
    currentStream.write('nom,adresse,postcode,city\n')
    for (let entreprise = await entreprises.next(); entreprise != null; entreprise = await entreprises.next()) {
      let line = `,"${entreprise.address}","${entreprise.postalCode}","${entreprise.city}"\n`;
      if (currentStream.bytesWritten + line.length >= 5e7) {
        currentStream.end()
        chunk++;
        path = `temp/ban/chunk_${chunk}.csv`;
        currentStream = fs.createWriteStream(path)
        paths.push(path);
        currentStream.write('nom,adresse,postcode,city\n')
      }
      currentStream.write(line)
    }

    currentStream.end()

    return paths;
  }

  /**
   * 
   * @param address 
   * @returns {Promise<LocalisationRecherche>} position and dep of the given address using BAN API
   */
  async findByAddress(address: String): Promise<LocalisationRecherche> {
    return axios
      .get(
        'https://api-adresse.data.gouv.fr/search/?q=' +
          address.replace(' ', '+'),
      )
      .then((res) => {
        let coordinates = res.data.features[0].geometry.coordinates;
        let departement = res.data.features[0].properties.postcode.slice(0, 2);
        return {
          pos: { lat: coordinates[1], long: coordinates[0] },
          departement: departement,
        };
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

  /**
   * 
   * @param address 
   * @returns {Promise<LocationEntrepriseEntity>} LocationEntrepriseEntity created using ban API on address
   */
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
        entreprises.filter((e: SireneEntrepriseEntity) => {
          let distance = this.calcDistance(pos.pos, {
            lat: e.latitude,
            long: e.longitude,
          });
          return distance <= radius;
        }),
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

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  /**
   * Converts numeric degrees to radians
   * @param deg 
   * @returns {number} radian 
   */
  private toRad(deg) {
    return (deg * Math.PI) / 180;
  }
}
