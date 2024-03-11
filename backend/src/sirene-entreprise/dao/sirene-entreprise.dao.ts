import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SireneEntreprise } from "../schemas/sirene-entreprise.schema";
import { Model } from "mongoose";
import { SireneEntrepriseEntity } from "../entities/sirene-entreprise.entity";

/**
 * DAO for accessing and manipulating data related to sireneEntreprises.
 */
@Injectable()
export class SireneEntrepriseDao {

  /**
   * @param _sireneEntrepriseModel mongoose model for sireneEntreprise entities.
   */
  constructor(
    @InjectModel(SireneEntreprise.name)
    private readonly _sireneEntrepriseModel: Model<SireneEntreprise>,
  ) { }

  /**
   * @returns {Promise<SireneEntreprise[]>} 1000 firsts sireneEntreprises with a name sorted asc
   */
  async findAll(): Promise<SireneEntreprise[]> {
    return await this._sireneEntrepriseModel.find({ "name": { $ne: "" } }).sort({ "name": 1 }).limit(1000)
  }

  /**
   * 
   * @param departement wanted companies dep
   * @returns {Promise<SireneEntrepriseEntity[]>} all sireneEntreprises with a name in the departement
   */
  async findAllInDepartement(departement: string): Promise<SireneEntrepriseEntity[]> {
    return await this._sireneEntrepriseModel.find({
      "name": { $ne: "" },
      $and: [
        { "postalCode": { $gte: departement + "000" } },
        { "postalCode": { $lte: departement + "999" } }
      ]
    })
  }

  /**
   * 
   * @param sorted
   * @returns a cursor of the query
   */
  async findAllLimitless(sorted: boolean) {
    return this._sireneEntrepriseModel.find({ "name": { $ne: "" } }).sort({ "_id": (sorted ? 1 : -1) }).cursor();
  }

  /**
   * 
   * @param siren siren number to search for
   * @returns {Promise<SireneEntreprise[] | null>} all sireneEntreprises that match the siren else null
   */
  async findBySiren(siren: string): Promise<SireneEntreprise[] | null> {
    return this._sireneEntrepriseModel.find({ "siren": siren })
  }

  /**
   * 
   * @param sireneEntrepriseEntity 
   * @returns {Promise<SireneEntreprise>} created sireneEntreprise
   */
  async save(sireneEntrepriseEntity: SireneEntrepriseEntity): Promise<SireneEntreprise> {
    const SireneEntreprise = new this._sireneEntrepriseModel(sireneEntrepriseEntity);
    return await SireneEntreprise.save();
  }

  /**
   * 
   * @param filter findOne filter
   * @param updateDatas datas to be updated
   * @returns {Promise<SireneEntreprise>} the sireneEntreprise updated
   */
  async update(filter, updateDatas): Promise<SireneEntreprise> {
    return this._sireneEntrepriseModel.findOneAndUpdate(filter, updateDatas, {returnOriginal: false})
  }

  /**
   * 
   * @returns {Promise<boolean>} true if the collection is empty else false
   */
  async isEmpty(): Promise<boolean> {
    return (await this._sireneEntrepriseModel.countDocuments()) == 0;
  }

  /**
   * delete all sireneEntreprise of the collection
   */
  async deleteAll(): Promise<void> {
    await this._sireneEntrepriseModel.deleteMany()
  }
}
