import { Test, TestingModule } from '@nestjs/testing';
import { SireneService } from './sirene.service';
import { EntrepriseEntity } from '../../entreprise/entities/entreprise.entity';

require('dotenv').config()

describe('SireneService', () => {
  let service: SireneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SireneService],
    }).compile();

    service = module.get<SireneService>(SireneService);
  });

  
  it('should be defined', () => {
    return expect(service).toBeDefined();
  });

  it('should return an EntrepriseEntity of the given siren using API', () => {
    const expected = new EntrepriseEntity();
    expected.siren = "338411101" 

    //test sur le siren car il ne risque pas de changer
    return expect(service.getEntrepriseAPI(expected.siren)).resolves.toHaveProperty("siren", expected.siren);
  })

  it('should return an error because the siren does not exist using API', () => {
    const expected = new EntrepriseEntity();
    expected.siren = "338411101zzz" 

    return expect(service.getEntrepriseAPI(expected.siren)).rejects.toEqual("AxiosError: Request failed with status code 400");
  })

  it('should return an EntrepriseEntity of the given siren using CSV', () => {
    const expected = new EntrepriseEntity();
    expected.siren = "338411101" 

    return expect(service.getEntrepriseCSV(expected.siren)).resolves.toEqual(service.getEntrepriseAPI(expected.siren))
  }, 3000000)

  it('should return an error because the siren does not exist using CSV', () => {
    const expected = new EntrepriseEntity();
    expected.siren = "999999999" 

    return expect(service.getEntrepriseCSV(expected.siren)).resolves.toEqual(new Error("not found"))
  }, 1800000) //30 min

  it('should return an error because the siren is not valid using CSV', () => {
    const expected = new EntrepriseEntity();
    expected.siren = "338411101zzz"

    return expect(service.getEntrepriseCSV(expected.siren)).rejects.toEqual(new Error("siren non valide"));
  })



});
