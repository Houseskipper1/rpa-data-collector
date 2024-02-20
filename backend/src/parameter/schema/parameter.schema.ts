import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'parameters' })
export class Parameter extends Document {
  @Prop({ required: false })
  id: string;

  @Prop({ required: true, unique: true }) // Définir unique: true pour rendre parameterName unique
  parameterName: string;

  @Prop({ required: true })
  refreshFrequency: number;

  @Prop({ required: true })
  lastUpdate: Date;
}

export const ParameterSchema = SchemaFactory.createForClass(Parameter);
