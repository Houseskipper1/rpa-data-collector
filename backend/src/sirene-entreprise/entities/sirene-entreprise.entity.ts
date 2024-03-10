import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class SireneEntrepriseEntity {
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
  nic: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  naf: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  name: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  address: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  city: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  postalCode: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  latitude: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  longitude: number;

}
