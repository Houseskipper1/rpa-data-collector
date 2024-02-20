import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'parameters' })
export class Parameter extends Document {
  @Prop()
  _id: number;

  @Prop({ required: true })
  parameterName: string;

  @Prop({ required: true })
  refreshFrequency: number;

  @Prop({ required: true })
  lastUpdate: Date;
}

export const ParameterSchema = SchemaFactory.createForClass(Parameter);
