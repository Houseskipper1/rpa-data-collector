import { Injectable } from '@nestjs/common';
import { EntrepriseDao } from '../dao/entreprise-dao';
import { EntrepriseEntity } from '../entities/entreprise.entity';

import { EntrepriseSchema } from '../schema/entreprise.schema';
@Injectable()
export class EntrepriseService {
  constructor(private readonly entrepriseDao: EntrepriseDao) {}

  async findById(id: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.findById(id);
  }

  async findAll(): Promise<EntrepriseEntity[]> {
    return this.entrepriseDao.findAll();
  }

  async update(id: string, updatedEntreprise: Partial<EntrepriseEntity>): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.update(id, updatedEntreprise);
  }

  async delete(id: string): Promise<void> {
    return this.entrepriseDao.delete(id);
  }
  async create(entreprise: EntrepriseSchema): Promise<EntrepriseEntity> {
    return await this.entrepriseDao.save(entreprise);
  }
  async findBySiren(siren: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.findBySiren(siren );
  }

  async findBySiret(siret: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.findBySiret(siret);
  }
}
