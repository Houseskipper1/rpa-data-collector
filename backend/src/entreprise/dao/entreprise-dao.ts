import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EntrepriseEntity } from '../entities/entreprise.entity';

@Injectable()
export class EntrepriseDao {
  constructor(
    @InjectModel(EntrepriseEntity.name)
    private readonly _entrepriseModel: Model<EntrepriseEntity>,
  ) {}

  async findById(id: string): Promise<EntrepriseEntity | null> {
    return await this._entrepriseModel.findById(id).exec();
  }

  async findAll(): Promise<EntrepriseEntity[]> {
    return await this._entrepriseModel.find().exec();
  }

  async update(id: string, updatedEntreprise: Partial<EntrepriseEntity>): Promise<EntrepriseEntity | null> {
    return await this._entrepriseModel.findByIdAndUpdate(id, updatedEntreprise, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this._entrepriseModel.findByIdAndDelete(id).exec();
  }
}
