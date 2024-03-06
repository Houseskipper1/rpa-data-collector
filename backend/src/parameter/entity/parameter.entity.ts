import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ParameterEntity{
  @Expose()
  @Type(() => String)
  @ApiProperty()
  id: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  parameterName: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  refreshFrequency: number;

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  lastUpdate: Date;
}
