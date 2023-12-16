import { Injectable } from '@nestjs/common';
import { EntrepriseDao } from '../dao/entreprise-dao';
import { EntrepriseEntity } from '../entities/entreprise.entity';

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
}
