import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { Fichier } from '../entities/fichier.entity';

@Injectable()
export class fichierDao {
  private fichiers: Fichier[] = [];
  nomFichier: string =
    'C:/Users/sherl/Documents/GitHub/rpa-data-collector/backend/ressources/RNCP/export_fiches_CSV_Blocs_De_Compétences_2024_01_17.csv';

  async lireFichierCSV(nombreLignes: number = 5): Promise<Fichier[]> {
    const nouvellesCompetences: Record<string, string[]> = {};

    return new Promise((resolve, reject) => {
      let lignesLues = 0;

      fs.createReadStream(this.nomFichier)
        .pipe(csv())
        .on('data', (row) => {
          if (lignesLues < nombreLignes) {
            const numeroFiche = row['Numero_Fiche'];
            const blocCompetencesLibelle = row['Bloc_Competences_Libelle'];

            if (numeroFiche && blocCompetencesLibelle) {
              if (this.fichiers.some((f) => f.code_fichier === numeroFiche)) {
                if (!nouvellesCompetences[numeroFiche]) {
                  nouvellesCompetences[numeroFiche] = [];
                }
                nouvellesCompetences[numeroFiche].push(blocCompetencesLibelle);
              } else {
                const nouveauFichier: Fichier = {
                  code_fichier: numeroFiche,
                  competences: [blocCompetencesLibelle],
                };
                this.fichiers.push(nouveauFichier);
              }
            }

            lignesLues++;
          } else {
            resolve(this.fichiers);
          }
        })
        .on('end', () => {
          for (const fichier of this.fichiers) {
            const numeroFiche = fichier.code_fichier;
            if (nouvellesCompetences[numeroFiche]) {
              fichier.competences = [
                ...fichier.competences,
                ...nouvellesCompetences[numeroFiche],
              ];
            }
          }
          resolve(this.fichiers);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
