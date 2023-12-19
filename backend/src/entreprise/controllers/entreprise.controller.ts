import { Controller, Get, Param, Put, Body, Delete, Post, Res } from '@nestjs/common';
import { EntrepriseService } from '../service/entreprise.service';
import { EntrepriseEntity } from '../entities/entreprise.entity';
import { EntrepriseSchema } from '../schema/entreprise.schema';

@Controller('entreprise')
export class EntrepriseController {
  constructor(private entrepriseService: EntrepriseService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.findById(id);
  }

  @Get()
  async findAll(): Promise<EntrepriseEntity[]> {
    return this.entrepriseService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedEntreprise: Partial<EntrepriseEntity>): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.update(id, updatedEntreprise);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.entrepriseService.delete(id);
  }
  
  @Post()
  async createEntreprise(@Body() entreprise: EntrepriseSchema): Promise<EntrepriseEntity> {
    return this.entrepriseService.create(entreprise);
  }
  @Get('siren/:siren')
  async findBySiren(@Param('siren') siren: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.findBySiren(siren);
  }

  @Get('siret/:siret')
  async findBySiret(@Param('siret') siret: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.findBySiret(siret);
  }
}


