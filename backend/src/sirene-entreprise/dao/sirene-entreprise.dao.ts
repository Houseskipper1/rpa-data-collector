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

  async findAllInDepartement(departement: String): Promise<SireneEntrepriseEntity[]> {
    return await this._sireneEntrepriseModel.find({
      "name": {$ne: ""},
      $and: [
        {"postalCode": {$gte: departement + "000"}},
        {"postalCode": {$lte: departement + "999"}}
      ]}).exec();
  }

  async findAllLimitless(sorted: boolean) {
    return this._sireneEntrepriseModel.find({"name": {$ne: ""}}).sort({"_id": (sorted ? 1 : -1)}).cursor();
  }

  async findBySiren(siren: string): Promise<SireneEntreprise[] | null> {
    return this._sireneEntrepriseModel.find({"siren": siren})
  }
  
  async save(sireneEntrepriseEntity: SireneEntrepriseEntity): Promise<SireneEntreprise> {
    const SireneEntreprise = new this._sireneEntrepriseModel(sireneEntrepriseEntity);
    return await SireneEntreprise.save();
  }

  async update(filter, updateDatas): Promise<SireneEntreprise> {
    return this._sireneEntrepriseModel.findOneAndUpdate(filter, updateDatas)
  }

  async isEmpty(): Promise<boolean> {
    return (await this._sireneEntrepriseModel.countDocuments()) == 0;
  }

  async deleteAll(): Promise<void> {
    await this._sireneEntrepriseModel.deleteMany().exec();
  }
}
