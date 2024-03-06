import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class LocationEntrepriseEntity {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  streetAddress: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  postalCode: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  city: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  department: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  departmentNumber: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  region: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  country: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  interventionZone: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  longitude: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  latitude: number;
}
