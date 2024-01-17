import { Injectable } from '@nestjs/common';
import axios from "axios";
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';

export type Position = {
    lat: number,
    long: number
}


@Injectable()
export class BanService {
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
}
