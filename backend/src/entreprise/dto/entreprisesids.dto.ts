import { ApiProperty } from '@nestjs/swagger';

export class EntreprisesIdsDto {
  @ApiProperty({
    example: 'sarl-favata-338411101,bati-france-57-851900654',
  })
  entreprises: string;
}
