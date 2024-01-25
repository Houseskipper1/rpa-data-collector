import { Injectable } from '@nestjs/common';
import axios from "axios";
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';
import { Long } from 'typeorm';

export type Position = {
    lat: number,
    long: number
}


@Injectable()
export class BanService {
    constructor(private readonly entrepriseService: EntrepriseService) { }

    async findByAddress(address: String): Promise<Position> {
        return axios.get("https://api-adresse.data.gouv.fr/search/?q=" + address.replace(' ', '+'))
            .then((res) => {
                let coordinates = res.data.features[0].geometry.coordinates;
                return { lat: coordinates[0], long: coordinates[1] };
            })
    }

    async findByPosition(pos: Position): Promise<string> {
        return axios.get("https://api-adresse.data.gouv.fr/reverse/?lon=" + pos.long + "&lat=" + pos.lat)
            .then((res) => {
                return res.data.features[0].properties
            }, (e) => e)
    }

    //Added By Zinou
    async findCompletedLocationByAddress(address: string): Promise<LocationEntrepriseEntity> {
        try {
            const res = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${address.replace(' ', '+')}&limit=1`);

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
                interventionZone: "inconnue",
                country: "France"
            } as LocationEntrepriseEntity;
        } catch (error) {
            console.error("Error fetching address:", error);
            return {} as LocationEntrepriseEntity;
        }
    }

    /**
     * @param {Position} pos - The center of the circle to search
     * @param {number} radius - The radius of the circle, in km
     *
     * @returns {Promise<EntrepriseEntity[]>} A promise of the list of entities inside the radius
     */
    async getInRadius(pos: Position, radius: number): Promise<EntrepriseEntity[]> {
        return this.entrepriseService.findAll().then((entreprises: EntrepriseEntity[]) => entreprises.filter((e: EntrepriseEntity) =>
            this.calcDistance(
                pos,
                { lat: e.location.latitude, long: e.location.longitude }
            ) <= radius))
    }

    /**
    * [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
    * @param {Position} pos1 - Position of the first location
    * @param {Position} pos2 - Position of the second location
    *
    * @returns {number} The distance between the two loactions, in km
    */
    private calcDistance(pos1: Position, pos2: Position): number {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(pos2.lat - pos1.lat);  // deg2rad below
        var dLon = this.deg2rad(pos2.long - pos1.long);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(pos1.lat)) * Math.cos(this.deg2rad(pos2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    private deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
}
