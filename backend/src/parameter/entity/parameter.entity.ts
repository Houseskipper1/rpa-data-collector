import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ParameterEntity {
  @Expose()
  @Type(() => String)
  id: string;

  @Expose()
  @Type(() => String)
  parameterName: string;

  @Expose()
  @Type(() => Number)
  refreshFrequency: number;

  @Expose()
  @Type(() => Date)
  lastUpdate: Date;
}
