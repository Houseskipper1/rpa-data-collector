import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntrepriseService } from '../service/entreprise.service';
import { PappersService } from 'src/scraping/entreprise/pappers.service';
import { EntrepriseEntity } from '../entities/entreprise.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('entreprise')
@ApiTags('entreprise')
export class EntrepriseController {
  constructor(
    private entrepriseService: EntrepriseService,
    private pappersService: PappersService,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<EntrepriseEntity | null> {
    try {
      const entreprise = await this.entrepriseService.findById(id);
      if (!entreprise) {
        throw new NotFoundException('Entreprise non trouvée');
      }
      return entreprise;
    } catch (error) {
      throw new BadRequestException('Erreur lors de la recherche de l\'entreprise');
    }
  }

  @Get()
  async findAll(): Promise<EntrepriseEntity[]> {
    try {
      return this.entrepriseService.findAll();
    } catch (error) {
      throw new BadRequestException('Erreur lors de la recherche des entreprises');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedEntreprise: Partial<EntrepriseEntity>,
  ): Promise<EntrepriseEntity | null> {
    try {
      return this.entrepriseService.update(id, updatedEntreprise);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour de l\'entreprise');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.entrepriseService.delete(id);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression de l\'entreprise');
    }
  }

  @Post()
  async createEntreprise(
    @Body() entreprise: EntrepriseEntity,
  ): Promise<EntrepriseEntity> {
    try {
      return this.entrepriseService.create(entreprise);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création de l\'entreprise');
    }
  }

  @Get('siren/:siren')
  async findBySiren(
    @Param('siren') siren: string,
  ): Promise<EntrepriseEntity | null> {
    try {
      const entreprise = await this.entrepriseService.findBySiren(siren);
      if (!entreprise) {
        throw new NotFoundException('Entreprise non trouvée');
      }
      return entreprise;
    } catch (error) {
      throw new BadRequestException('Erreur lors de la recherche de l\'entreprise par SIREN');
    }
  }

  @Get('siret/:siret')
  async findBySiret(
    @Param('siret') siret: string,
  ): Promise<EntrepriseEntity | null> {
    try {
      const entreprise = await this.entrepriseService.findBySiret(siret);
      if (!entreprise) {
        throw new NotFoundException('Entreprise non trouvée');
      }
      return entreprise;
    } catch (error) {
      throw new BadRequestException('Erreur lors de la recherche de l\'entreprise par SIRET');
    }
  }
}
