import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EntrepriseReviewEntity {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  reviewId: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  user: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  title: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  content: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  rating: number;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  datePosted: string;
}
