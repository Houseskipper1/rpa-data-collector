import { Injectable } from '@nestjs/common';
import { SireneEntrepriseEntity } from '../entities/sirene-entreprise.entity';
import { SireneEntrepriseDao } from '../dao/sirene-entreprise.dao';
import { NafService } from './naf.service';

@Injectable()
export class SireneEntrepriseService {
  constructor(
    private readonly _sireneEntrepriseDao: SireneEntrepriseDao,
    private readonly _nafService: NafService,
  ) {}

  async findAll(): Promise<SireneEntrepriseEntity[]> {
    let sireneEntreprises = await this._sireneEntrepriseDao.findAll();
    for (const sireneEntreprise of sireneEntreprises) {
      sireneEntreprise.naf = (
        await this._nafService.findById(sireneEntreprise.naf)
      ).desc;
    }
    return sireneEntreprises;
  }

  async findAllInDepartement(
    departement: String,
  ): Promise<SireneEntrepriseEntity[]> {
    let sireneEntreprises =
      await this._sireneEntrepriseDao.findAllInDepartement(departement);
    for (const sireneEntreprise of sireneEntreprises) {
      sireneEntreprise.naf = (
        await this._nafService.findById(sireneEntreprise.naf)
      ).desc;
    }
    return sireneEntreprises;
  }

  async findAllForBan(sorted: boolean) {
    return this._sireneEntrepriseDao.findAllLimitless(sorted);
  }

  async findBySiren(siren: string): Promise<SireneEntrepriseEntity[]> {
    return this._sireneEntrepriseDao.findBySiren(siren);
  }

  async create(
    newSireneEntreprise: SireneEntrepriseEntity,
  ): Promise<SireneEntrepriseEntity> {
    return await this._sireneEntrepriseDao.save(newSireneEntreprise);
  }

  async update(filter, updateDatas): Promise<SireneEntrepriseEntity> {
    return await this._sireneEntrepriseDao.update(filter, updateDatas);
  }

  async deleteAll(): Promise<void> {
    return this._sireneEntrepriseDao.deleteAll();
  }

  async isEmpty(): Promise<boolean> {
    return await this._sireneEntrepriseDao.isEmpty();
  }
}
