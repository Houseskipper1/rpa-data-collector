import { Injectable } from '@nestjs/common';
import { Naf } from '../schemas/naf.schema';
import { NafEntity } from '../entities/naf.entity';
import { NafDao } from '../dao/naf.dao';

/**
 * Service for handling NAFs related operations
 */
@Injectable()
export class NafService {

  /**
   * 
   * @param _nafDao DAO for NAF entities
   */
  constructor(private readonly _nafDao: NafDao) { }

  /**
   * @param id the id of the NAF entity.
   * @returns { Promise<Naf>} naf 
   */
  async findById(id: string): Promise<Naf> {
    return this._nafDao.findById(id);
  }

  /**
   * @param code the code of the NAF entity.
   * @returns { Promise<Naf>} naf
   */
  async findByCode(code: string): Promise<Naf> {
    return this._nafDao.findByCode(code);
  }

  /**
   * 
   * @param naf naf entity to create
   * @returns {Promise<NafEntity>} created naf entity
   */
  async create(naf: NafEntity): Promise<NafEntity> {
    return await this._nafDao.save(naf);
  }
}
