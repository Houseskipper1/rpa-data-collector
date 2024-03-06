import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'parameters' })
export class Parameter extends Document {
  @Prop({ required: false })
  @ApiProperty()
  id: string;

  @Prop({ required: true, unique: true }) // Définir unique: true pour rendre parameterName unique
  @ApiProperty()
  parameterName: string;

  @Prop({ required: true })
  @ApiProperty()
  refreshFrequency: number;

  @Prop({ required: true })
  @ApiProperty()
  lastUpdate: Date;
}

export const ParameterSchema = SchemaFactory.createForClass(Parameter);
