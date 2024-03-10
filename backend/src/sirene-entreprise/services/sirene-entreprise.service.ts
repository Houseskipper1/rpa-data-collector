import { Injectable } from '@nestjs/common';
import { SireneEntrepriseEntity } from '../entities/sirene-entreprise.entity';
import { SireneEntrepriseDao } from '../dao/sirene-entreprise.dao';
import { NafService } from './naf.service';

/**
 * Service for handling SireneEntreprises related operations
 */
@Injectable()
export class SireneEntrepriseService {

  /**
   * 
   * @param _sireneEntrepriseDao DAO for sirenEntreprise entities
   * @param _nafService Naf Service
   */
  constructor(private readonly _sireneEntrepriseDao: SireneEntrepriseDao,
    private readonly _nafService: NafService) { }

  /**
   * 
   * @returns {Promise<SireneEntrepriseEntity[]>} all sireneEntreprises
   */
  async findAll(): Promise<SireneEntrepriseEntity[]> {
    let sireneEntreprises = await this._sireneEntrepriseDao.findAll();
    for (const sireneEntreprise of sireneEntreprises) {
      sireneEntreprise.naf = (await this._nafService.findById(sireneEntreprise.naf)).desc;
    }
    return sireneEntreprises;
  }

  /**
   * 
   * @param departement wanted companies dep
   * @returns {Promise<SireneEntrepriseEntity[]>} all sireneEntreprises in the dep
   */
  async findAllInDepartement(departement: string): Promise<SireneEntrepriseEntity[]> {
    let sireneEntreprises = await this._sireneEntrepriseDao.findAllInDepartement(departement);
    for (const sireneEntreprise of sireneEntreprises) {
      sireneEntreprise.naf = (await this._nafService.findById(sireneEntreprise.naf)).desc;
    }
    return sireneEntreprises;
  }

  /**
   * 
   * @param sorted 
   * @returns a cursor of the results
   */
  async findAllForBan(sorted: boolean) {
    return this._sireneEntrepriseDao.findAllLimitless(sorted);
  }

  /**
   * 
   * @param siren siren number to search for
   * @returns {Promise<SireneEntrepriseEntity[]>} all sireneEntreprises that match the siren
   */
  async findBySiren(siren: string): Promise<SireneEntrepriseEntity[]> {
    return this._sireneEntrepriseDao.findBySiren(siren);
  }

  /**
   * 
   * @param newSireneEntreprise 
   * @returns {Promise<SireneEntrepriseEntity>} created sireneEntreprise
   */
  async create(newSireneEntreprise: SireneEntrepriseEntity): Promise<SireneEntrepriseEntity> {
    return await this._sireneEntrepriseDao.save(newSireneEntreprise);
  }

  /**
   * 
   * @param filter filter to find the model
   * @param updateDatas datas to be updated
   * @returns {Promise<SireneEntreprise>} the sireneEntreprise updated
   */
  async update(filter, updateDatas): Promise<SireneEntrepriseEntity> {
    return await this._sireneEntrepriseDao.update(filter, updateDatas);
  }

  /**
   * delete all models from the collection
   * @returns {Promise<void>}
   */
  async deleteAll(): Promise<void> {
    return this._sireneEntrepriseDao.deleteAll();
  }

  /**
   * 
   * @returns {Promise<boolean>} true of empty else false
   */
  async isEmpty(): Promise<boolean> {
    return await this._sireneEntrepriseDao.isEmpty();
  }

}
