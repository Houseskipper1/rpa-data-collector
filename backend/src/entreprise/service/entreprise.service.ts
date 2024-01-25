import { Injectable } from '@nestjs/common';
import { EntrepriseDao } from '../dao/entreprise-dao';
import { EntrepriseEntity } from '../entities/entreprise.entity';

@Injectable()
export class EntrepriseService {
  constructor(private readonly entrepriseDao: EntrepriseDao) {}

  async findById(id: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.findById(id);
  }

  async findAll(): Promise<EntrepriseEntity[]> {
    return this.entrepriseDao.findAll();
  }

  async update(
    id: string,
    updatedEntreprise: Partial<EntrepriseEntity>,
  ): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.update(id, updatedEntreprise);
  }

  async delete(id: string): Promise<void> {
    return this.entrepriseDao.delete(id);
  }

  async create(entreprise: EntrepriseEntity): Promise<EntrepriseEntity> {
    return await this.entrepriseDao.save(entreprise);
  }

  async createOrUpdateBySirene(entreprise: EntrepriseEntity): Promise<EntrepriseEntity> {
    entreprise.siren = entreprise.siren.replace(/\s/g, "");
    entreprise.siret = entreprise.siret.replace(/\s/g, "");
    return await this.entrepriseDao.saveOrUpdateBySirene(entreprise.siren, entreprise);
  }

  async findBySiren(siren: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.findBySiren(siren);
  }

  async findBySiret(siret: string): Promise<EntrepriseEntity | null> {
    return this.entrepriseDao.findBySiret(siret);
  }

  async exportToCSV(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let csvData = '';
      const headerRow =
        [
          'id',
          'siren',
          'siret',
          'name',
          'dateCreation',
          'yearsInExistence',
          'effective',
          'dateConfirmationEffectif',
          'representativeFirstName',
          'representativeLastName',
          'representativePosition',
          'representativeAge',
        ].join(',') + '\n';

      csvData += headerRow;
      const dataStatic = await this.findAll();
      dataStatic.forEach((data) => {
        const representative = data.representatives[0];
        const rowData =
          [
            data.id,
            data.siren,
            data.siret,
            data.name,
            data.dateCreation,
            data.yearsInExistence,
            data.effective,
            data.dateConfirmationEffectif,
            representative.firstName,
            representative.lastName,
            representative.position,
            representative.age,
          ].join(',') + '\n';

        csvData += rowData;
      });
      resolve(csvData);
    });
  }

  
  async exportToJSON(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const jsonData = [];
      const dataStatic = await this.findAll();
      dataStatic.forEach((data) => {        
        jsonData.push(data);
      });
      const jsonString = JSON.stringify(jsonData, null, 2);
      resolve(jsonString);
    });
  }
  
}
