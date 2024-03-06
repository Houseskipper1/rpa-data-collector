import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Representative extends Document {
  @Prop({ required: false })
  @ApiProperty()
  firstName: string;

  @Prop({ required: false })
  @ApiProperty()
  lastName: string;

  @Prop({ required: false })
  @ApiProperty()
  age: number;

  @Prop({ required: false })
  @ApiProperty()
  position: string;
}

export const RepresentativeSchema =
  SchemaFactory.createForClass(Representative);
