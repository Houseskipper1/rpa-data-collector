import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EntrepriseRepresentativeEntity } from '../entities/entreprise.representative.entity';
import { EntrepriseRepresentativeEntitySchema } from './representative.schema';

@Schema({ collection: 'entreprise' })
export class EntrepriseSchema extends Document {
  @Prop({ required: false })
  id: string;

  @Prop({ required: true })
  siren: string;

  @Prop({ required: true })
  siret: string;

  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true })
  dateCreation: string;

  @Prop({ required: true })
  yearsInExistence: number;

  @Prop({ required: true })
  effective: string;

  @Prop({ required: true })
  dateConfirmationEffectif: string;

  @Prop({ type: [EntrepriseRepresentativeEntitySchema] })
  representatives: EntrepriseRepresentativeEntity[]; 
}

export const EntrepriseEntitySchema = SchemaFactory.createForClass(EntrepriseSchema);
