import { Exclude, Expose, Type } from 'class-transformer';

export class EntrepriseReviewEntity {

  @Expose()
  @Type(() => String)
  reviewId: string;
  
  @Expose()
  @Type(() => String)
  user: string;
  
  @Expose()
  @Type(() => String)
  title: string;
  
  @Expose()
  @Type(() => String)
  content: string;
  
  @Expose()
  @Type(() => Number)
  rating: number;
  
  @Expose()
  @Type(() => String)
  datePosted: string;
}
