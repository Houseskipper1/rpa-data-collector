import { Injectable } from '@nestjs/common';
import { SireneEntrepriseEntity } from '../entities/sirene-entreprise.entity';
import { SireneEntrepriseDao } from '../dao/sirene-entreprise.dao';
import { NafService } from './naf.service';

@Injectable()
export class SireneEntrepriseService {
  constructor(private readonly _sireneEntrepriseDao: SireneEntrepriseDao, 
              private readonly _nafService: NafService) {}

  async findAll(): Promise<SireneEntrepriseEntity[]> {
    let sireneEntreprises = await this._sireneEntrepriseDao.findAll();
    for(const sireneEntreprise of sireneEntreprises){
      sireneEntreprise.naf = (await this._nafService.findById(sireneEntreprise.naf)).desc;
    }
    return sireneEntreprises;
  }

  async findAllForBan(): Promise<SireneEntrepriseEntity[]> {
    return this._sireneEntrepriseDao.findAllLimitless();
  }

  async findBySiren(siren: string): Promise<SireneEntrepriseEntity> {
    return await this._sireneEntrepriseDao.findBySiren(siren);
  }

  async create(newSireneEntreprise: SireneEntrepriseEntity): Promise<SireneEntrepriseEntity> {
    return await this._sireneEntrepriseDao.save(newSireneEntreprise);
  }

  async update(updatedSireneEntreprise: SireneEntrepriseEntity): Promise<SireneEntrepriseEntity> {
    return await this._sireneEntrepriseDao.save(updatedSireneEntreprise);
  }

  async deleteAll(): Promise<void> {
    return this._sireneEntrepriseDao.deleteAll();
  }

  async isEmpty(): Promise<boolean>{
    return await this._sireneEntrepriseDao.isEmpty();
  }

}
