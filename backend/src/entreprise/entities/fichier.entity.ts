import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class Fichier {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  code_fichier: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  competences: string[];
}
