import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EntrepriseRepresentativeEntity extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  position: string;
}

export const EntrepriseRepresentativeEntitySchema = SchemaFactory.createForClass(EntrepriseRepresentativeEntity);
