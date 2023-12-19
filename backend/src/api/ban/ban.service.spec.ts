import { Test, TestingModule } from '@nestjs/testing';
import { BanService, Position } from './ban.service';

describe('BanService', () => {
  let service: BanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanService],
    }).compile();

    service = module.get<BanService>(BanService);
  });

  describe('findByAddress', () => {
    it('should find a position in Amiens', async () => {
      const address = "8 bd du port";

      let position = await service.findByAddress(address);
      
      expect(position).toStrictEqual({ lat: 2.290084, long: 49.897442 });
    })

    it('should return a street in Prunay-sur-Essonne', async () => {
      const expected = {
        city: "Prunay-sur-Essonne",
        citycode: "91507",
        context: "91, Essonne, Île-de-France",
        distance: 148,
        housenumber: "23",
        id: "91507_0100_00023",
        importance: 0.26322,
        label: "23 Grande Rue 91720 Prunay-sur-Essonne",
        name: "23 Grande Rue",
        postcode: "91720",
        score: 0.999991124741495,
        street: "Grande Rue",
        type: "housenumber",
        x: 653420.06,
        y: 6806364.89
      };

      const position = { lat: 48.357, long: 2.37} as Position;

      let address = await service.findByPosition(position);

      expect(address).toEqual(expected);
    })
  })
});
