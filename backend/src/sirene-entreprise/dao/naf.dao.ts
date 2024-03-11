import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Naf } from '../schemas/naf.schema';
import { Model } from 'mongoose';
import { NafEntity } from '../entities/naf.entity';

@Injectable()
export class NafDao {
  constructor(
    @InjectModel(Naf.name)
    private readonly _nafModel: Model<Naf>,
  ) {}

  async findById(id: string): Promise<Naf | null> {
    return await this._nafModel.findById(id).exec();
  }

  async findByCode(code: string): Promise<Naf | null> {
    return await this._nafModel.findOne({ code: code }).exec();
  }

  async save(naf: NafEntity): Promise<Naf> {
    const newNaf = new this._nafModel(naf);
    return await newNaf.save();
  }

  async deleteAll(): Promise<void> {
    await this._nafModel.deleteMany().exec();
  }
}
