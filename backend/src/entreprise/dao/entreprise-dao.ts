import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {Entreprise } from '../schema/entreprise.schema';
import { EntrepriseEntity } from '../entities/entreprise.entity';

@Injectable()
export class EntrepriseDao {
  constructor(
    @InjectModel(Entreprise.name)
    private readonly _entrepriseModel: Model<Entreprise>,
  ) {}

  async findById(id: string): Promise<Entreprise | null> {
    return await this._entrepriseModel.findById(id).exec();
  }

  async findAll(): Promise<Entreprise[]> {
    return await this._entrepriseModel.find().exec();
  }

  async update(
    id: string,
    updatedEntreprise: Partial<EntrepriseEntity>,
  ): Promise<Entreprise | null> {
    return await this._entrepriseModel
      .findByIdAndUpdate(id, updatedEntreprise, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this._entrepriseModel.findByIdAndDelete(id).exec();
  }

  async save(entreprise: EntrepriseEntity): Promise<Entreprise> {
    const newEntreprise = new this._entrepriseModel(entreprise);
    return await newEntreprise.save();
  }
  async findBySiren(siren: string): Promise<Entreprise | null> {
    return this._entrepriseModel.findOne({ siren }).exec();
  }

  async findBySiret(siret: string): Promise<Entreprise | null> {
    return this._entrepriseModel.findOne({ siret }).exec();
  }
}
