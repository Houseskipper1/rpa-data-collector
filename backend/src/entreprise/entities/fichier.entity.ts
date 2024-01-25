import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class Fichier {
  @Expose()
  @Type(() => String)
  code_fichier: string;

  @Expose()
  @Type(() => String)
  competences: string[];
}
