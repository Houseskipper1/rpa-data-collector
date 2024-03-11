import { ApiProperty } from '@nestjs/swagger';

export class ScrapSirenesDto {
  @ApiProperty({
    example: '["companySiret1", "companySiret2", ...]',
  })
  entreprises: string[];
}
