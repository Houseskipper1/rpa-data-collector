import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Representative extends Document {
  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false })
  position: string;
}

export const RepresentativeSchema =
  SchemaFactory.createForClass(Representative);
