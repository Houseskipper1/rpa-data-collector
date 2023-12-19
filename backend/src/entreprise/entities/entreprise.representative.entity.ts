import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class EntrepriseRepresentativeEntity {
  @Expose()
  @Type(() => String)
  firstName: string;

  @Expose()
  @Type(() => String)
  lastName: string;

  @Expose()
  age: number;

  @Expose()
  @Type(() => String)
  position: string;

  @Expose()
  @Type(() => String)
  employmentStartDate: string;
}
