import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Review extends Document {
  @Prop({ required: false })
  reviewId: string;

  @Prop({ required: false })
  user: string;
  
  @Prop({ required: false })
  title: string;
  
  @Prop({ required: false })
  content: string;
  
  @Prop({ required: false })
  rating: number;
  
  @Prop({ required: false })
  datePosted: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
