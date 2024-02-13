import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class NafEntity {
  @Expose()
  @Type(() => String)
  id: string;

  @Expose()
  @Type(() => String)
  code: string;

  @Expose()
  @Type(() => String)
  desc: string;
}
