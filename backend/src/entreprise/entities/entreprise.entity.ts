import { FinanceEntrepriseEntity } from './entreprise.Finance.entity';
import { LocationEntrepriseEntity } from './entreprise.location.entity';
import { EntrepriseRepresentativeEntity } from './entreprise.representative.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class EntrepriseEntity {
  @Expose()
  @Type(() => String)
  id: string;

  @Expose()
  @Type(() => String)
  siren: string;

  @Expose()
  @Type(() => String)
  siret: string;

  @Expose()
  @Type(() => String)
  name: string;

  @Expose()
  @Type(() => String)
  dateCreation: string;

  @Expose()
  @Type(() => String)
  yearsInExistence: number;

  @Expose()
  @Type(() => String)
  effective: string;

  @Expose()
  @Type(() => String)
  dateConfirmationEffectif: string;

  @Expose()
  @Type(() => EntrepriseRepresentativeEntity)
  representatives: EntrepriseRepresentativeEntity[];

  @Expose()
  @Type(() => LocationEntrepriseEntity)
  location: LocationEntrepriseEntity;


  @Expose()
  @Type(() => String)
  shareCapital: string;   // capital social

  @Expose()
  @Type(() => FinanceEntrepriseEntity)
  financeDetails: FinanceEntrepriseEntity[];


  @Expose()
  @Type(() => String)
  lastDataSource: string; // New field: Name of the last data source exemple pappers....

  @Expose()
  @Type(() => Date)
  created: Date;  // date when the entity is added to the BD
  
  @Expose()
  @Type(() => Date)
  updated: Date;     // date when the entity is updated 
}
