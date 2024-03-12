import { Test, TestingModule } from '@nestjs/testing';
import { BanService, Position } from './ban.service';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';
import { SireneEntrepriseService } from 'src/sirene-entreprise/services/sirene-entreprise.service';
import { EntrepriseDao } from 'src/entreprise/dao/entreprise-dao';
import { Entreprise } from 'src/entreprise/schema/entreprise.schema';
import { getModelToken } from '@nestjs/mongoose';
import { SireneEntrepriseDao } from 'src/sirene-entreprise/dao/sirene-entreprise.dao';
import { SireneEntreprise } from 'src/sirene-entreprise/schemas/sirene-entreprise.schema';
import { NafService } from 'src/sirene-entreprise/services/naf.service';
import { Naf } from 'src/sirene-entreprise/schemas/naf.schema';
import { NafDao } from 'src/sirene-entreprise/dao/naf.dao';

describe('BanService', () => {
  let service: BanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanService, EntrepriseService, SireneEntrepriseService, EntrepriseDao, SireneEntrepriseDao, NafService, NafDao,
        { provide: getModelToken(Entreprise.name), useValue: jest.fn()},
        { provide: getModelToken(SireneEntreprise.name), useValue: jest.fn()},
        { provide: getModelToken(Naf.name), useValue: jest.fn()}


      ],
    }).compile();

    service = module.get<BanService>(BanService);
  });

  describe('findByAddress', () => {
    it('should find a position in Amiens', async () => {
      const address = '8 bd du port';
      const expected = {
        "departement": "95",
        "pos": {
          "lat": 49.031624,
          "long": 2.062821
        }
      }

      let position = await service.findByAddress(address);

      expect(position).toStrictEqual(expected);
    });

    it('should return a street in Prunay-sur-Essonne', async () => {
      const expected = {
        city: 'Prunay-sur-Essonne',
        citycode: '91507',
        context: '91, Essonne, Île-de-France',
        distance: 148,
        housenumber: '23',
        id: '91507_0100_00023',
        importance: 0.26322,
        label: '23 Grande Rue 91720 Prunay-sur-Essonne',
        name: '23 Grande Rue',
        postcode: '91720',
        score: 0.999991124741495,
        street: 'Grande Rue',
        type: 'housenumber',
        x: 653420.06,
        y: 6806364.89,
      };

      const position = { lat: 48.357, long: 2.37 } as Position;

      let address = await service.findByPosition(position);

      expect(address).toEqual(expected);
    });
  });
});
