import { Controller, Get, Param, Query } from '@nestjs/common';
import { FichierService } from '../service/fichier.service';
import { Fichier } from '../entities/fichier.entity';

@Controller('fichiers')
export class FichierController {
  constructor(private fichierService: FichierService) {}

  @Get()
  async lireFichierCSV(
    @Query('nombreLignes') nombreLignes: number = 5,
  ): Promise<Fichier[]> {
    return this.fichierService.lireFichierCSV(nombreLignes);
  }
}
