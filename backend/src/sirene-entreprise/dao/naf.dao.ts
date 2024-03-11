import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Naf } from '../schemas/naf.schema';
import { Model } from 'mongoose';
import { NafEntity } from '../entities/naf.entity';


/**
 * DAO for accessing and manipulating data related to NAF codes.
 */
@Injectable()
export class NafDao {

  /**
   * @param _nafModel mongoose model for NAF entities.
   */
  constructor(
    @InjectModel(Naf.name)
    private readonly _nafModel: Model<Naf>,
  ) { }

  /**
   * @param id the id of the NAF entity.
   * @returns { Promise<Naf | null>} naf if exist else null
   */
  async findById(id: string): Promise<Naf | null> {
    return await this._nafModel.findById(id).exec();
  }

  /**
   * @param code the code of the NAF entity.
   * @returns { Promise<Naf | null>} naf if exist else null
   */
  async findByCode(code: string): Promise<Naf | null> {

    return await this._nafModel.findOne({ "code": code }).exec()

  }

  /**
   * @param naf entity to save.
   * @returns {Promise<Naf>} created naf entity
   */
  async save(naf: NafEntity): Promise<Naf> {
    const newNaf = new this._nafModel(naf);
    return await newNaf.save();
  }

  /**
   * delete all NAF entities.
   */
  async deleteAll(): Promise<void> {
    await this._nafModel.deleteMany().exec();
  }
}
