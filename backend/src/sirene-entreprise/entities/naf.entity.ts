import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class NafEntity {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  id: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  code: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  desc: string;
}
