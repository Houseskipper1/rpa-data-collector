import { Test, TestingModule } from '@nestjs/testing';
import { SirenService } from './siren.service';
import { EntrepriseEntity } from '../../entreprise/entities/entreprise.entity';

require('dotenv').config()

describe('SirenService', () => {
  let service: SirenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SirenService],
    }).compile();

    service = module.get<SirenService>(SirenService);
  });

  
  it('should be defined', () => {
    return expect(service).toBeDefined();
  });

  it('should return an EntrepriseEntity of the given siren', () => {
    const expected = new EntrepriseEntity();
    expected.siren = "338411101" 

    //test sur le siren car il ne risque pas de changer
    return expect(service.getEntrepriseAPI(expected.siren)).resolves.toHaveProperty("siren", expected.siren);
  })

  it('should return an error because the siren does not exist', () => {
    const expected = new EntrepriseEntity();
    expected.siren = "338411101zzz" 

    return expect(service.getEntrepriseAPI(expected.siren)).rejects.toEqual("AxiosError: Request failed with status code 400");
  })
});
