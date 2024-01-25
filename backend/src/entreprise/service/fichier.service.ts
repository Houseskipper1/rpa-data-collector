import { Injectable } from '@nestjs/common';
import { fichierDao } from '../dao/fichier-dao';
import { Fichier } from '../entities/fichier.entity';

@Injectable()
export class FichierService {
    constructor(private fichierDao: fichierDao) {}

    async lireFichierCSV(nombreLignes: number = 5): Promise<Fichier[]> {
        
        return this.fichierDao.lireFichierCSV(nombreLignes);
    }

  
}
