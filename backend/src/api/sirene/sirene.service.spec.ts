import { Test, TestingModule } from '@nestjs/testing';
import { SireneService } from './sirene.service';
import { EntrepriseEntity } from '../../entreprise/entities/entreprise.entity';
import { SireneEntreprise } from 'src/sirene-entreprise/schemas/sirene-entreprise.schema';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';
import { SireneEntrepriseService } from 'src/sirene-entreprise/services/sirene-entreprise.service';
import { NafService } from 'src/sirene-entreprise/services/naf.service';
import { BanService } from '../ban/ban.service';
import { EntrepriseDao } from 'src/entreprise/dao/entreprise-dao';
import { SireneEntrepriseDao } from 'src/sirene-entreprise/dao/sirene-entreprise.dao';
import { NafDao } from 'src/sirene-entreprise/dao/naf.dao';
import { getModelToken } from '@nestjs/mongoose';
import { Entreprise } from 'src/entreprise/schema/entreprise.schema';
import { Naf } from 'src/sirene-entreprise/schemas/naf.schema';

require('dotenv').config();

describe('SireneService', () => {
  let service: SireneService;

  const mockEntrepriseService = {
    createOrUpdateBySirene: jest.fn().mockImplementation((entreprise) => {
      // Logique de mock personnalisée ici
      return entreprise; // Par exemple, renvoyer l'entreprise sans modification
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SireneService, SireneEntrepriseService, NafService, BanService, EntrepriseDao, SireneEntrepriseDao, NafDao,
        { provide: EntrepriseService, useValue: mockEntrepriseService },
        { provide: getModelToken(Entreprise.name), useValue: jest.fn() },
        { provide: getModelToken(SireneEntreprise.name), useValue: jest.fn() },
        { provide: getModelToken(Naf.name), useValue: jest.fn() }

      ],
    }).compile();

    service = module.get<SireneService>(SireneService);
  });

  it('should be defined', () => {
    return expect(service).toBeDefined();
  });

  it('should return an EntrepriseEntity of the given siret using API', () => {
    const expected = new EntrepriseEntity();
    expected.siret = '33841110100029';

    return expect(
      service.getEntrepriseAPI(expected.siret),
    ).resolves.toHaveProperty('siret', expected.siret);
  });

  it('should return an error because the siret does not exist using API', () => {
    const expected = new EntrepriseEntity();
    expected.siret = '33841110100099';

    return expect(service.getEntrepriseAPI(expected.siret)).rejects.toEqual(
      'AxiosError: Request failed with status code 404',
    );
  });

  // it('should return an EntrepriseEntity of the given siret using CSV', () => {
  //   const expected = new EntrepriseEntity();
  //   expected.siret = '33841110100029';

  //   return expect(service.getEntrepriseCSV(expected.siret)).resolves.toEqual(
  //     service.getEntrepriseAPI(expected.siret),
  //   );
  // }, 3000000);

  // it('should return an error because the siret does not exist using CSV', () => {
  //   const expected = new EntrepriseEntity();
  //   expected.siret = '99999999999999';

  //   return expect(service.getEntrepriseCSV(expected.siret)).resolves.toEqual(
  //     new Error('not found'),
  //   );
  // }, 1800000); //30 min

  it('should return an error because the siret is not valid using CSV', () => {
    const expected = new EntrepriseEntity();
    expected.siret = '338411101zzz';

    return expect(service.getEntrepriseCSV(expected.siret)).rejects.toEqual(
      new Error('siret non valide'),
    );
  });

  it('should return true because the naf code is a chossen one', () => {
    const nafCodeTested = "43.29B";

    return expect(service.isSelectedNaf(nafCodeTested)).toBe(true);
  })

  it('should return false because the naf code isn\'t a chossen one', () => {
    const nafCodeTested = "99.48A";

    return expect(service.isSelectedNaf(nafCodeTested)).toBe(false);
  })
});
