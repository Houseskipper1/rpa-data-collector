import { Injectable } from '@nestjs/common';
import axios from "axios";
//TODO trouver pourquoi "/src/entreprise/entities/entreprise.entity" marche pas pour jest
import { EntrepriseEntity } from '../../entreprise/entities/entreprise.entity';

import * as fs from 'fs';
import * as yauzl from 'yauzl'
import { parseStream } from 'fast-csv';
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';
import { EntrepriseDao } from 'src/entreprise/dao/entreprise-dao';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';

@Injectable()
export class SireneService {
    //numero siret SARL FAVATA, SARL BATI 57 et LENNINGER RENOV
    //private _entrepriseSirets: String[] = ["33841110100029", "43929893600055", "91834707100014"];
    private _ressourcePath = "ressources/sirene/";
    private pathsUrls;
    private _baseUrlUL = "https://api.insee.fr/entreprises/sirene/V3/siren/";
    private _baseURLStockEtab = "https://api.insee.fr/entreprises/sirene/V3/siret/"
    private _effectifsRep = {null : null,
                             ""  : null,
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
    constructor(private _entrepriseService: EntrepriseService){
        this.pathsUrls = [
            {"name": "StockUL"  , "url": "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip"},
            {"name": "StockEtab", "url": "https://files.data.gouv.fr/insee-sirene/StockEtablissement_utf8.zip"}
        ];
    }

    private unzipAndRemove(zipPath: string, csvPath: string){
        try{
            console.log("Début du dézip de "+ zipPath)
            yauzl.open(zipPath, {lazyEntries: true}, (err, zipfile) => {
                if (err) throw err;
                zipfile.readEntry();
                zipfile.on("entry", function(entry) {
                    if(/\/$/.test(entry.fileName)){
                        //dossier
                        fs.mkdirSync("ressources/sirene/" + entry.fileName, {recursive: true});
                        zipfile.readEntry();
                    }else{
                        //fichier 
                        zipfile.openReadStream(entry, function(err, readStream) {
                        if (err) throw err;
                        readStream.pipe(fs.createWriteStream("ressources/sirene/" + entry.fileName))
                        readStream.on("end", function() {
                          zipfile.readEntry();
                        });
                      });
                    }
                });
              });
              console.log("Dézip terminé")
              //fs.unlinkSync(zipPath)
        }
        catch (err){
            console.error(err)
        }  
    }
    
    private async downloadCSV(path: string, url: string){
        const file = fs.createWriteStream(path);
        try{
            console.log("Début du téléchargement de " + url)
            const response = await axios.get(url, {responseType: "arraybuffer"});
            const fileData = Buffer.from(response.data, 'binary');
            await file.write(fileData)
            console.log("Téléchargement terminé");
            file.close()
        }
        catch(err){
            fs.unlink(path, () => console.error(err.message));
        }
    }

    private async getSireneCSVs(){
        for(const datas of this.pathsUrls){
            console.log(datas)
            let csvPath = this._ressourcePath + datas["name"] + ".csv";
            let zipPath = this._ressourcePath + datas["name"] + ".zip";
            if(!fs.existsSync(csvPath)){
                 await this.downloadCSV(zipPath, datas["url"])
                           .then(() =>{
                             this.unzipAndRemove(zipPath, csvPath);
                           });
            }
        }

        return fs.createReadStream(this._ressourcePath + "StockUniteLegale_utf8.csv")

    }


    // private addULToEntity(res, entreprise: EntrepriseEntity): EntrepriseEntity{
    //     //Identité
    //     entreprise.siren = res.siren;
    //     entreprise.dateCreation = res.dateCreationUniteLegale;
    //     if(entreprise.dateCreation){ //cas ou l'unité unitePurgeeUniteLegale=true => pas de date de création
    //         entreprise.yearsInExistence = new Date().getFullYear() - new Date(entreprise.dateCreation).getFullYear(); 
    //     }
    //     entreprise.effective = this._effectifsRep[res.trancheEffectifsUniteLegale];
    //     entreprise.dateConfirmationEffectif = res.anneeEffectifsUniteLegale;
    //     return entreprise
    // }

    private addStockEtabToEntity(res, entreprise: EntrepriseEntity): EntrepriseEntity{
        //Identité
        entreprise.siret = res.siret;
        entreprise.siren = res.siren;
        entreprise.dateCreation = res.dateCreationEtablissement;
        if(entreprise.dateCreation){ //cas ou l'unité unitePurgeeUniteLegale=true => pas de date de création
            entreprise.yearsInExistence = new Date().getFullYear() - new Date(entreprise.dateCreation).getFullYear(); 
        }
        entreprise.effective = this._effectifsRep[res.trancheEffectifsEtablissement];
        entreprise.dateConfirmationEffectif = res.anneeEffectifsEtablissement;

        entreprise.name = res.uniteLegale.denominationUniteLegale ? res.uniteLegale.denominationUniteLegale : res.periodesEtablissement[0].denominationUsuelleEtablissement;
        
        //Localisation
        res = res.adresseEtablissement;
        let entrepriseLoc = new LocationEntrepriseEntity;
        entrepriseLoc.streetAddress        = res.numeroVoieEtablissement + " " + (res.typeVoieEtablissement?res.typeVoieEtablissement+" ":"") + res.libelleVoieEtablissement;
        if(res.codeCommuneEtablissement){ //France
            entrepriseLoc.postalCode       = res.codePostalEtablissement;
            entrepriseLoc.departmentNumber = entrepriseLoc.postalCode.slice(0,2);
            entrepriseLoc.city             = res.libelleCommuneEtablissement; 
            entrepriseLoc.country          = "France";
        }
        else{ //Autre
            entrepriseLoc.city             = res.libelleCommuneEtrangerEtablissement;
            entrepriseLoc.country          = res.libellePaysEtrangerEtablissement;
        }
        entreprise.location = entrepriseLoc;
        return entreprise
    }

    async getEntrepriseAPI(entrepriseSiret): Promise<EntrepriseEntity>{
        let entreprise = new EntrepriseEntity;

        await axios.get(this._baseURLStockEtab + entrepriseSiret, {
                        headers: {
                            "Authorization": `Bearer ${process.env.SIREN_API_KEY}`
                        }
                    })
                    .then((res) => {
                        //console.log(res.data.etablissement)
                        return this.addStockEtabToEntity(res.data.etablissement, entreprise)
                    })
                    .catch((err) => {
                        return Promise.reject(err.toString());
                    })
        const savedEntity = await this._entrepriseService.createOrUpdateBySirene(entreprise);
        return savedEntity;
    }

    async getEntreprisesAPI(entrepriseSirets: string[]): Promise<Promise<EntrepriseEntity>[]>{
        let res : Promise<EntrepriseEntity>[] = [];
        for (let siret of entrepriseSirets){
            res.push(this.getEntrepriseAPI(siret));
        }
        return res;
    }

    // FONCTION DE DEZIP CASSE
    
    // async getEntrepriseCSV(entrepriseSiren: string): Promise<EntrepriseEntity>{
    //     if(!/^\d{9}$/.test(entrepriseSiren)){
    //         return Promise.reject(new Error("siren non valide"));
    //     }
    //     //a changer
    //     let stream = await this.getSireneCSVs();
    //     console.log("Début de la recherche CSV, cela peut prendre quelques minutes...")
    //     return new Promise((resolve, reject) => {
    //         parseStream(stream, {headers: true})
    //         .on('error', error => console.error(error))
    //         .on('data', row => {
    //             if(row.siren == entrepriseSiren){
    //                 let entreprise = new EntrepriseEntity;
    //                 //this.addULToEntity(row, entreprise);
    //                 stream.close();
    //                 resolve(entreprise);
    //             }
    //         })
    //         .on('end', (rowCount: number) => {
    //             console.log(rowCount)
    //             stream.close();
    //             reject(new Error("not found"));
    //         })
    //     });
    // }

}