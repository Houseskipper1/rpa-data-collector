import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SireneEntreprise } from "../schemas/sirene-entreprise.schema";
import { Model } from "mongoose";
import { SireneEntrepriseEntity } from "../entities/sirene-entreprise.entity";

@Injectable()
export class SireneEntrepriseDao {
  constructor(
    @InjectModel(SireneEntreprise.name)
    private readonly _sireneEntrepriseModel: Model<SireneEntreprise>,
  ) {}

  async findAll(): Promise<SireneEntreprise[]> {
    return await this._sireneEntrepriseModel.find({"name": {$ne: ""}}).sort({"name": 1}).limit(1000).exec();
  }

  async findAllLimitless() {
    return await this._sireneEntrepriseModel.find({"name": {$ne: ""}}).exec();
  }

  async findBySiren(siren: string): Promise<SireneEntreprise[] | null> {
    return await this._sireneEntrepriseModel.find({"siren": siren}).exec()
  }
  
  async save(sireneEntrepriseEntity: SireneEntrepriseEntity): Promise<SireneEntreprise> {
    const SireneEntreprise = new this._sireneEntrepriseModel(sireneEntrepriseEntity);
    return await SireneEntreprise.save();
  }

  async isEmpty(): Promise<boolean> {
    return (await this._sireneEntrepriseModel.countDocuments()) == 0;
  }

  async deleteAll(): Promise<void> {
    await this._sireneEntrepriseModel.deleteMany().exec();
  }
}
