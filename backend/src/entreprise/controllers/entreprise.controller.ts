import { Controller, Get, Param, Put, Body, Delete } from '@nestjs/common';
import { EntrepriseService } from '../service/entreprise.service';
import { EntrepriseEntity } from '../entities/entreprise.entity';

@Controller('entreprise')
export class EntrepriseController {
  constructor(private readonly entrepriseService: EntrepriseService) {}

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

}
