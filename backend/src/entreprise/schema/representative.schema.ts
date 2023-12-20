import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EntrepriseRepresentativeEntity extends Document {
  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false })
  position: string;
}

export const EntrepriseRepresentativeEntitySchema =
  SchemaFactory.createForClass(EntrepriseRepresentativeEntity);
