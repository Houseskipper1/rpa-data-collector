import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Review extends Document {
  @Prop({ required: false })
  @ApiProperty()
  reviewId: string;

  @Prop({ required: false })
  @ApiProperty()
  user: string;

  @Prop({ required: false })
  @ApiProperty()
  title: string;

  @Prop({ required: false })
  @ApiProperty()
  content: string;

  @Prop({ required: false })
  @ApiProperty()
  rating: number;

  @Prop({ required: false })
  @ApiProperty()
  datePosted: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
