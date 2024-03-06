import { ApiProperty } from '@nestjs/swagger';

export class ScrapSirenesDto {
  @ApiProperty()
  'entreprises': string[];
}
