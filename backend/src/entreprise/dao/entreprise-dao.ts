import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EntrepriseSchema } from '../schema/entreprise.schema';
import { EntrepriseEntity } from '../entities/entreprise.entity';

@Injectable()
export class EntrepriseDao {
  constructor(
    @InjectModel(EntrepriseSchema.name)
    private readonly _entrepriseModel: Model<EntrepriseSchema>,
  ) {}

  async findById(id: string): Promise<EntrepriseSchema | null> {
    return await this._entrepriseModel.findById(id).exec();
  }

  async findAll(): Promise<EntrepriseSchema[]> {
    return await this._entrepriseModel.find().exec();
  }

  async update(
    id: string,
    updatedEntreprise: Partial<EntrepriseEntity>,
  ): Promise<EntrepriseSchema | null> {
    return await this._entrepriseModel
      .findByIdAndUpdate(id, updatedEntreprise, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this._entrepriseModel.findByIdAndDelete(id).exec();
  }

  async save(entreprise: EntrepriseEntity): Promise<EntrepriseSchema> {
    const newEntreprise = new this._entrepriseModel(entreprise);
    return await newEntreprise.save();
  }
  async findBySiren(siren: string): Promise<EntrepriseSchema | null> {
    return this._entrepriseModel.findOne({ siren }).exec();
  }

  async findBySiret(siret: string): Promise<EntrepriseSchema | null> {
    return this._entrepriseModel.findOne({ siret }).exec();
  }
}
