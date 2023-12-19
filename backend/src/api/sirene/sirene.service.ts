import { Injectable } from '@nestjs/common';
import axios from "axios";
//TODO trouver pourquoi "/src/entreprise/entities/entreprise.entity" marche pas pour jest
import { EntrepriseEntity } from '../../entreprise/entities/entreprise.entity';

import * as fs from 'fs';
import * as yauzl from 'yauzl'
import { parseStream } from 'fast-csv';

@Injectable()
export class SireneService {
    //numero siret SARL FAVATA, SARL BATI 57 et LENNINGER RENOV
    //private _entrepriseSirets: String[] = ["33841110100029", "43929893600055", "91834707100014"];
    private _ressourcePath = "ressources/sirene/";
    private _zipPath = this._ressourcePath+"StockUL.zip"
    private _stockULDownloadURL = "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip"
    private _baseUrl = "https://api.insee.fr/entreprises/sirene/V3/siren/";
    private _effectifsRep = {''  : null,
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
    constructor(){}

    private unzipAndRemoveStockUL(){
        const ressourcePath = this._ressourcePath;
        try{
            console.log("Début du dézip de StockUnitéLegale")
            yauzl.open(this._zipPath, {lazyEntries: true}, (err, zipfile) => {
                if (err) throw err;
                zipfile.readEntry();
                zipfile.on("entry", function(entry) {
                    if(/\/$/.test(entry.fileName)){
                        //dossier
                        fs.mkdirSync(ressourcePath + entry.fileName, {recursive: true});
                        zipfile.readEntry();
                    }else{
                        //fichier 
                        zipfile.openReadStream(entry, function(err, readStream) {
                        if (err) throw err;
                        readStream.pipe(fs.createWriteStream(ressourcePath + entry.fileName))
                        readStream.on("end", function() {
                          zipfile.readEntry();
                        });
                      });
                    }
                });
              });
              console.log("Dézip terminé")
              fs.unlinkSync(ressourcePath+"StockUL.zip")
        }
        catch (err){
            console.error(err)
        }  
    }
    
    private async downloadStockUL(){
        const file = fs.createWriteStream(this._zipPath);
        try{
            console.log("Début du téléchargement de StockUnitéLegale")
            const response = await axios.get(this._stockULDownloadURL, {responseType: "arraybuffer"});
            const fileData = Buffer.from(response.data, 'binary');
            await file.write(fileData)
            console.log("Téléchargement terminé");
            file.close()
        }
        catch(err){
            fs.unlink(this._zipPath, () => console.error(err.message));
        }
    }

    private async getSireneCSV(){
        if(!fs.existsSync(this._ressourcePath+"StockUniteLegale_utf8.csv")){
            await this.downloadStockUL()
                      .then(() =>{
                        this.unzipAndRemoveStockUL();
                      });
        }
        return fs.createReadStream(this._ressourcePath + "StockUniteLegale_utf8.csv")
            
    }

    private generateEntreprise(res): EntrepriseEntity{
        let entreprise = new EntrepriseEntity();
        entreprise.siren = res.siren;
        entreprise.dateCreation = res.dateCreationUniteLegale;
        if(entreprise.dateCreation){ //cas ou l'unité unitePurgeeUniteLegale=true => pas de date de création
            entreprise.yearsInExistence = new Date().getFullYear() - new Date(entreprise.dateCreation).getFullYear(); 
        }
        entreprise.effective = this._effectifsRep[res.trancheEffectifsUniteLegale];
        entreprise.dateConfirmationEffectif = res.anneeEffectifsUniteLegale;
        return entreprise
    }

    async getEntrepriseAPI(entrepriseSiren: string): Promise<EntrepriseEntity>{
        return axios.get(this._baseUrl + entrepriseSiren, {
                         headers: {
                             "Authorization": `Bearer ${process.env.SIREN_API_KEY}`
                         }
                        })
                    .then((res) => {
                        return this.generateEntreprise(res.data.uniteLegale)
                    })
                    .catch((err) =>{
                        return Promise.reject(err.toString());
                    })
    }

    async getEntrepriseCSV(entrepriseSiren: string): Promise<EntrepriseEntity>{
        if(!/^\d{9}$/.test(entrepriseSiren)){
            return Promise.reject(new Error("siren non valide"));
        }
        //a changer
        let stream = await this.getSireneCSV();
        console.log("Début de la recherche CSV, cela peut prendre quelques minutes...")
        return new Promise((resolve, reject) => {
            parseStream(stream, {headers: true})
            .on('error', error => console.error(error))
            .on('data', row => {
                if(row.siren == entrepriseSiren){
                    const entreprise = this.generateEntreprise(row);
                    stream.close();
                    resolve(entreprise);
                }
            })
            .on('end', (rowCount: number) => {
                console.log(rowCount)
                stream.close();
                reject(new Error("not found"));
            })
        });
    }

}