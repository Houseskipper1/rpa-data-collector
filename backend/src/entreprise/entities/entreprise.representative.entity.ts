import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class EntrepriseRepresentativeEntity {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  firstName: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  age: number;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  position: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  employmentStartDate: string;
}
