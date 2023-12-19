import { Injectable } from '@nestjs/common';
import axios from "axios";

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
}
