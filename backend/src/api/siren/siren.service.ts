import { Injectable } from '@nestjs/common';
import axios from "axios";
//TODO trouver pourquoi "/src/entreprise/entities/entreprise.entity" marche pas pour jest
import { EntrepriseEntity } from '../../entreprise/entities/entreprise.entity';
import { error } from 'console';

@Injectable()
export class SirenService {
    //numero siret SARL FAVATA, SARL BATI 57 et LENNINGER RENOV
    //private _entrepriseSirets: String[] = ["33841110100029", "43929893600055", "91834707100014"];
    private _baseUrl = "https://api.insee.fr/entreprises/sirene/V3/siren/";
    private _effectifsRep = {null: null,
                             "NN": null,
                             "00": "0",
                             "01": "1-2",
                             "02": "3-5",
                             "03": "6-9",
                             "11": "10-19",
                             "12": "20-49",
                             "21": "50-99",
                             "22": "100-199",
                             "31": "200-249",
                             "32": "250-499",
                             "41": "500-999",
                             "42": "1000-1999",
                             "51": "2000-4999",
                             "52": "5000-9999",
                             "53": "10000+"
                            }

    async getEntrepriseAPI(entrepriseSiren: string): Promise<EntrepriseEntity>{
        let entreprise = new EntrepriseEntity();
        return axios.get(this._baseUrl + entrepriseSiren, {
                         headers: {
                             "Authorization": `Bearer ${process.env.SIREN_API_KEY}`
                         }
                        })
                    .then((res) => {
                        entreprise.siren = res.data.uniteLegale.siren;
                        entreprise.dateCreation = res.data.uniteLegale.dateCreationUniteLegale;
                        if(entreprise.dateCreation){ //cas ou l'unité unitePurgeeUniteLegale=true => pas de date de création
                            entreprise.yearsInExistence = new Date().getFullYear() - new Date(entreprise.dateCreation).getFullYear(); 
                        }
                        entreprise.effective = this._effectifsRep[res.data.uniteLegale.trancheEffectifsUniteLegale];
                        entreprise.dateConfirmationEffectif = res.data.uniteLegale.anneeEffectifsUniteLegale;
                        return entreprise
                    })
                    .catch((err) =>{
                        return Promise.reject(err.toString());
                    })
    }

}
