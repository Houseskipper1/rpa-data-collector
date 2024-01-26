import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Entreprise } from '../schema/entreprise.schema';
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
      .findByIdAndUpdate(id, updatedEntreprise, { new: false })
      .exec();
  }

  async saveOrUpdateBySirene(
    siren: string,
    updatedEntreprise: EntrepriseEntity,
  ): Promise<Entreprise | null> {
    const existingEntreprise = await this._entrepriseModel
      .findOne({ siren })
      .exec();

    if (existingEntreprise) {
      const updatedFields: Partial<EntrepriseEntity> = {};
      this.recursiveUpdate(updatedEntreprise, updatedFields);

      if (Object.keys(updatedFields).length > 0) {
        return await this.update(
          existingEntreprise._id,
          updatedFields as EntrepriseEntity,
        );
      } else {
        return existingEntreprise;
      }
    } else {
      return await this.save(updatedEntreprise);
    }
  }

  private recursiveUpdate(
    source: Record<string, any>,
    target: Record<string, any>,
  ): void {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];

      if (sourceValue !== undefined && sourceValue !== null) {
        if (typeof sourceValue === 'object') {
          target[key] = target[key] || {};
          this.recursiveUpdate(sourceValue, target[key]);
        } else {
          target[key] = sourceValue;
        }
      }
    });
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
