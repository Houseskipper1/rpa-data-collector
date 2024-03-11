import { FinanceEntrepriseEntity } from './entreprise.Finance.entity';
import { LocationEntrepriseEntity } from './entreprise.location.entity';
import { EntrepriseRepresentativeEntity } from './entreprise.representative.entity';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class EntrepriseEntity {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  id: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  siren: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  siret: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  name: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  dateCreation: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  yearsInExistence: number;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  effective: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  dateConfirmationEffectif: string;

  @Expose()
  @Type(() => EntrepriseRepresentativeEntity)
  @ApiProperty()
  representatives: EntrepriseRepresentativeEntity[];

  @Expose()
  @Type(() => LocationEntrepriseEntity)
  @ApiProperty()
  location: LocationEntrepriseEntity;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  shareCapital: string; // capital social

  @Expose()
  @Type(() => FinanceEntrepriseEntity)
  @ApiProperty()
  financeDetails: FinanceEntrepriseEntity[];

  @Expose()
  @Type(() => String)
  @ApiProperty()
  lastDataSources: string; // New field: Name of the last data source exemple pappers....

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  created: Date; // date when the entity is added to the BD

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  updated: Date; // date when the entity is updated
}
