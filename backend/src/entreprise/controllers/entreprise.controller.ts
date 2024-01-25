import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { EntrepriseService } from '../service/entreprise.service';
import { PappersService } from 'src/scraping/entreprise/pappers.service';
import { EntrepriseEntity } from '../entities/entreprise.entity';

@Controller('entreprise')
export class EntrepriseController {
  constructor(
    private entrepriseService: EntrepriseService,
    private pappersService: PappersService,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.findById(id);
  }

  @Get()
  async findAll(): Promise<EntrepriseEntity[]> {
    return this.entrepriseService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedEntreprise: Partial<EntrepriseEntity>,
  ): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.update(id, updatedEntreprise);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.entrepriseService.delete(id);
  }

  @Post()
  async createEntreprise(
    @Body() entreprise: EntrepriseEntity,
  ): Promise<EntrepriseEntity> {
    return this.entrepriseService.create(entreprise);
  }

  @Get('siren/:siren')
  async findBySiren(
    @Param('siren') siren: string,
  ): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.findBySiren(siren);
  }

  @Get('siret/:siret')
  async findBySiret(
    @Param('siret') siret: string,
  ): Promise<EntrepriseEntity | null> {
    return this.entrepriseService.findBySiret(siret);
  }

  @Put('scraping/pappers')
  async scrappingPappers(@Body() data: any): Promise<void> {
    this.pappersService.scrap(data.ids);
  }
}
