import { Injectable } from '@nestjs/common';
import axios from 'axios';
//TODO trouver pourquoi "/src/entreprise/entities/entreprise.entity" marche pas pour jest
import { EntrepriseEntity } from '../../entreprise/entities/entreprise.entity';

import * as fs from 'fs';
import * as yauzl from 'yauzl';
import { parseStream } from 'fast-csv';
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';
import { SireneEntrepriseService } from 'src/sirene-entreprise/services/sirene-entreprise.service';
import { NafService } from 'src/sirene-entreprise/services/naf.service';
import { NafEntity } from 'src/sirene-entreprise/entities/naf.entity';
import { SireneEntrepriseEntity } from 'src/sirene-entreprise/entities/sirene-entreprise.entity';
import { BanService } from '../ban/ban.service';

@Injectable()
export class SireneService {
  private _ressourcePath = 'ressources/sirene/';
  private pathsUrls;
  // private _baseUrlUL = "https://api.insee.fr/entreprises/sirene/V3/siren/";
  private _baseURLStockEtab =
    'https://api.insee.fr/entreprises/sirene/V3/siret/';
  private _effectifsRep = {
    null: null,
    '': null,
    'NN': null,
    '00': '0',
    '01': '1-2',
    '02': '3-5',
    '03': '6-9',
    '11': '10-19',
    '12': '20-49',
    '21': '50-99',
    '22': '100-199',
    '31': '200-249',
    '32': '250-499',
    '41': '500-999',
    '42': '1000-1999',
    '51': '2000-4999',
    '52': '5000-9999',
    '53': '10000+',
  };

  constructor(private _entrepriseService: EntrepriseService,
              private _sireneEntrepriseService: SireneEntrepriseService,
              private _nafService: NafService,
              private _banService: BanService
              ) {
    this.pathsUrls = [
      {"name": "StockUL"  , "url": "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip"},
      {
        name: 'StockEtab',
        url: 'https://files.data.gouv.fr/insee-sirene/StockEtablissement_utf8.zip',
      },
    ];
  }

  private async unzipAndRemove(
    zipPath: string,
    csvPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Début du dézip de ' + zipPath);
        yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
          if (err) {
            reject(err);
            return;
          }
          zipfile.readEntry();
          zipfile.on('entry', function (entry) {
            // Fichier
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) {
                return Promise.reject(err);
              }
              readStream.pipe(fs.createWriteStream(csvPath));
              readStream.on('end', function () {
                zipfile.readEntry();
              });
            });
          });
          zipfile.on('end', function () {
            console.log('Dézip terminé');
            fs.unlinkSync(zipPath);
            resolve();
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private async downloadCSV(path: string, url: string) {
    const file = fs.createWriteStream(path);
    try {
      console.log('Début du téléchargement de ' + url);
      const response = await axios.get(url, { responseType: 'stream' });
      response.data.pipe(file);
      await new Promise((resolve, reject) => {
          file.on('finish', resolve);
          file.on('error', reject);
      });
      console.log('Téléchargement terminé');
    } catch (err) {
      fs.unlink(path, () => console.error(err.message));
    }
  }

  private async getSireneCSVs() {
    let streams = {}
    for (const pathDatas of this.pathsUrls) {
      let zipPath = this._ressourcePath + pathDatas['name'] + '.zip';
      let csvPath = this._ressourcePath + pathDatas['name'] + '.csv';
      if (!fs.existsSync(csvPath)) {
        await this.downloadCSV(zipPath, pathDatas['url'])
        await this.unzipAndRemove(zipPath, csvPath);
      }
      streams[pathDatas['name']] = fs.createReadStream(csvPath)
    }

    return streams;
  }

  private addStockEtabToEntity(
    res,
    entreprise: EntrepriseEntity,
    isCSV: boolean,
  ): EntrepriseEntity {
    console.log(res)
    // Identité
    entreprise.siret = res.siret;
    entreprise.siren = res.siren;
    entreprise.dateCreation = res.dateCreationEtablissement;
    if (entreprise.dateCreation) {
      // Cas ou l'unité unitePurgeeUniteLegale=true => pas de date de création
      entreprise.yearsInExistence =
        new Date().getFullYear() -
        new Date(entreprise.dateCreation).getFullYear();
    }
    entreprise.effective =
      this._effectifsRep[res.trancheEffectifsEtablissement];
    entreprise.dateConfirmationEffectif = res.anneeEffectifsEtablissement;

    if (isCSV) {
      entreprise.name = res.denominationUsuelleEtablissement;
    } else {
      entreprise.name = res.uniteLegale.denominationUniteLegale
        ? res.uniteLegale.denominationUniteLegale
        : res.periodesEtablissement[0].denominationUsuelleEtablissement;
      res = res.adresseEtablissement;
    }

    // Localisation
    let entrepriseLoc = new LocationEntrepriseEntity();
    entrepriseLoc.streetAddress =
      res.numeroVoieEtablissement +
      ' ' +
      (res.typeVoieEtablissement ? res.typeVoieEtablissement + ' ' : '') +
      res.libelleVoieEtablissement;
    if (res.codeCommuneEtablissement) {
      // France
      entrepriseLoc.postalCode = res.codePostalEtablissement;
      entrepriseLoc.departmentNumber = entrepriseLoc.postalCode.slice(0, 2);
      entrepriseLoc.city = res.libelleCommuneEtablissement;
      entrepriseLoc.country = 'France';
    } else {
      // Autre
      entrepriseLoc.city = res.libelleCommuneEtrangerEtablissement;
      entrepriseLoc.country = res.libellePaysEtrangerEtablissement;
    }
    entreprise.location = entrepriseLoc;
    return entreprise;
  }

  async getEntrepriseAPI(entrepriseSiret): Promise<EntrepriseEntity> {
    let entreprise = new EntrepriseEntity();

    await axios
      .get(this._baseURLStockEtab + entrepriseSiret, {
        headers: {
          Authorization: `Bearer ${process.env.SIREN_API_KEY}`,
        },
      })
      .then((res) => {
        return this.addStockEtabToEntity(
          res.data.etablissement,
          entreprise,
          false,
        );
      })
      .catch((err) => {
        return Promise.reject(err.toString());
      });
    const savedEntity =
      await this._entrepriseService.createOrUpdateBySirene(entreprise);
    return savedEntity;
  }

  async getEntreprisesAPI(
    entrepriseSirets: string[],
  ): Promise<Promise<EntrepriseEntity>[]> {
    let res: Promise<EntrepriseEntity>[] = [];
    for (let siret of entrepriseSirets) {
      res.push(this.getEntrepriseAPI(siret));
    }
    return res;
  }

  async getEntrepriseCSV(entrepriseSiret: string): Promise<EntrepriseEntity> {
    if (!/^\d{14}$/.test(entrepriseSiret)) {
      return Promise.reject(new Error('siret non valide'));
    }
    // À changer
    let stream = await this.getSireneCSVs()["StockEtab"];

    console.log(
      'Début de la recherche CSV, cela peut prendre quelques minutes...',
    );
    return new Promise((resolve, reject) => {
      parseStream(stream, { headers: true })
        .on('error', (error) => console.error(error))
        .on('data', (row) => {
          if (row.siret == entrepriseSiret) {
            let entreprise = new EntrepriseEntity();
            this.addStockEtabToEntity(row, entreprise, true);
            stream.close();
            resolve(entreprise);
          }
        })
        .on('end', (rowCount: number) => {
          stream.close();
          reject(new Error('not found'));
        });
    });
  }

  async getEntreprisesCSV(
    entrepriseSirets: string[],
  ): Promise<Promise<EntrepriseEntity>[]> {
    let res: Promise<EntrepriseEntity>[] = [];
    for (let siret of entrepriseSirets) {
      res.push(this.getEntrepriseCSV(siret));
    }
    return res;
  }

  private isSelectedNaf(nafCodes, nafCodeTested): boolean{
    for(const naf of nafCodes){
        if(naf.code === nafCodeTested){
            return true;
        }
    }
    return false;
  }

  async populateSireneEntreprise(){
    if(await this._sireneEntrepriseService.isEmpty()){
        let nafCodes = JSON.parse(await fs.promises.readFile(this._ressourcePath + "NafCodes.json", "utf-8"))["NafCodes"];
        for (const naf of nafCodes){
            await this._nafService.create(naf as NafEntity)
        }
        let streams = await this.getSireneCSVs();
        let c = 0
        console.log('Début de la création de la liste d\'entreprise simple (cela prend environ 1h30 minutes)');
        let timeStart = new Date()


        parseStream(streams["StockEtab"], { headers: true })
        .on('error', (error) => console.error(error))
        .on('data', async (row) => {
            c += 1;
            if (this.isSelectedNaf(nafCodes, row.activitePrincipaleEtablissement)) {
                let sireneEntreprise = new SireneEntrepriseEntity();
                sireneEntreprise.siren = row.siren;
                sireneEntreprise.nic = row.nic;
                // [ND] lorsque le statut de diffusion de l'etablissement est en non diffusable (tatutDiffusionEtablissement = P)
                sireneEntreprise.name = ["", "[ND]"].includes(row.denominationUsuelleEtablissement) ? "" : row.denominationUsuelleEtablissement;
                sireneEntreprise.postalCode = ["", "[ND]"].includes(row.codePostalEtablissement) ? null : row.codePostalEtablissement;
                let address = row.numeroVoieEtablissement + " " + row.typeVoieEtablissement + " " + row.libelleVoieEtablissement;
                sireneEntreprise.address = address.includes("[ND]") ? "" : address;
                sireneEntreprise.city = row.libelleCommuneEtablissement;
                sireneEntreprise.naf = (await this._nafService.findByCode(row.activitePrincipaleEtablissement))._id;
                this._sireneEntrepriseService.create(sireneEntreprise);
            }
            if (c%100000 == 0){
                console.log(c);
            }
        })
        .on('end', (rowCount: number) => {
            let timeEnd = new Date()
            console.log("Fin de la création en " + (timeEnd.getTime() - timeStart.getTime()) + " ms" )
            streams["StockEtab"].close();

            //patch des nom dans le cas d'une unité légal.
            console.log('Début du patch des noms des etablissements en cas d\'unité légal (cela prend environ 15 minutes');
            timeStart = new Date()

            c = 0
            parseStream(streams["StockUL"], { headers: true })
            .on('error', (error) => console.error(error))
            .on('data', async (row) => {
                c += 1;
                if (this.isSelectedNaf(nafCodes, row.activitePrincipaleEtablissement)) {
                    let sireneEntreprise = await this._sireneEntrepriseService.findBySiren(row.siren);
                    if(sireneEntreprise && sireneEntreprise.name == ""){
                      sireneEntreprise.name = row.prenomUsuelUniteLegale + " " + row.nomUniteLegale
                      await this._sireneEntrepriseService.update(sireneEntreprise);
                    }
                }
                if (c%100000 == 0){
                  console.log(c);
                }

            })
            .on('end', (rowCount: number) => {
                let timeEnd = new Date()
                console.log("Fin du patch des noms en " + (timeEnd.getTime() - timeStart.getTime()) + " ms" )
                streams["StockEtab"].close();
                console.log('Début de la mise à jour de la liste d\'entreprise simple');
                // this._banService.updateSireneEntreprise();
            });
        });
    }
  }

}
