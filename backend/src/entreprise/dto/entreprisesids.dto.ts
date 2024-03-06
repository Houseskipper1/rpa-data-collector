import { ApiProperty } from '@nestjs/swagger';

export class EntreprisesIdsDto {
  @ApiProperty()
  entreprises: string;
}
