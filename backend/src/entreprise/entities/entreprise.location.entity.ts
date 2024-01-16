import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class LocationEntrepriseEntity {
  @Expose()
  @Type(() => String)
  streetAddress: string;

  @Expose()
  @Type(() => String)
  postalCode: string;

  @Expose()
  @Type(() => String)
  city: string;

  @Expose()
  @Type(() => String)
  department: string;

  @Expose()
  @Type(() => String)
  departmentNumber: string;

  @Expose()
  @Type(() => String)
  region: string;

  @Expose()
  @Type(() => String)
  country: string;
  
  @Expose()
  @Type(() => String)
  interventionZone: string;

  @Expose()
  @Type(() => Number)
  longitude: number;

  @Expose()
  @Type(() => Number)
  latitude: number;

}