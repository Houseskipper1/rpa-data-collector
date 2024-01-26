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

  it('should return an EntrepriseEntity of the given siret using API', () => {
    const expected = new EntrepriseEntity();
    expected.siret = "33841110100029" 

    //test sur le siret car il ne risque pas de changer
    return expect(service.getEntrepriseAPI(expected.siret)).resolves.toHaveProperty("siret", expected.siret);
  })

  it('should return an error because the siret does not exist using API', () => {
    const expected = new EntrepriseEntity();
    expected.siret = "33841110100099" 

    return expect(service.getEntrepriseAPI(expected.siret)).rejects.toEqual("AxiosError: Request failed with status code 400");
  })

  it('should return an EntrepriseEntity of the given siret using CSV', () => {
    const expected = new EntrepriseEntity();
    expected.siret = "33841110100029" 

    return expect(service.getEntrepriseCSV(expected.siret)).resolves.toEqual(service.getEntrepriseAPI(expected.siret))
  }, 3000000)

  it('should return an error because the siret does not exist using CSV', () => {
    const expected = new EntrepriseEntity();
    expected.siret = "99999999999999" 

    return expect(service.getEntrepriseCSV(expected.siret)).resolves.toEqual(new Error("not found"))
  }, 1800000) //30 min

  it('should return an error because the siret is not valid using CSV', () => {
    const expected = new EntrepriseEntity();
    expected.siret = "338411101zzz"

    return expect(service.getEntrepriseCSV(expected.siret)).rejects.toEqual(new Error("siret non valide"));
  })



});
