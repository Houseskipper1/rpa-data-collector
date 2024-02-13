import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class SireneEntrepriseEntity {
  @Expose()
  @Type(() => String)
  id: string;

  @Expose()
  @Type(() => String)
  siren: string;

  @Expose()
  @Type(() => String)
  nic: string;

  @Expose()
  @Type(() => String)
  naf: string;

  @Expose()
  @Type(() => String)
  name: string;

  @Expose()
  @Type(() => Number)
  postalCode: number;
}
