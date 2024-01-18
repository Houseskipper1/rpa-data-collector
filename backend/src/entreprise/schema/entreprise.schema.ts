import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EntrepriseRepresentativeEntity } from '../entities/entreprise.representative.entity';
import { RepresentativeSchema } from './representative.schema';
import { LocationSchema } from './location.schema';
import { LocationEntrepriseEntity } from '../entities/entreprise.location.entity';
import { FinanceSchema } from './finance.schema';
import { FinanceEntrepriseEntity } from '../entities/entreprise.Finance.entity';

@Schema({ collection: 'entreprise' })
export class Entreprise extends Document {
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

  @Prop({ type: [RepresentativeSchema] })
  representatives: EntrepriseRepresentativeEntity[];


  @Prop({ type: [LocationSchema] })
  location: LocationEntrepriseEntity;


  @Prop({ type: [FinanceSchema] })
  financeDetails: FinanceEntrepriseEntity[];


}

export const EntrepriseSchema =
  SchemaFactory.createForClass(Entreprise);
