import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EntrepriseRepresentativeEntity } from '../entities/entreprise.representative.entity';
import { RepresentativeSchema } from './representative.schema';
import { LocationSchema } from './location.schema';
import { LocationEntrepriseEntity } from '../entities/entreprise.location.entity';
import { FinanceSchema } from './finance.schema';
import { FinanceEntrepriseEntity } from '../entities/entreprise.Finance.entity';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'entreprises' })
export class Entreprise extends Document {
  @Prop({ required: false })
  @ApiProperty()
  id: string;

  @Prop({ required: true })
  @ApiProperty()
  siren: string;

  @Prop({ required: true })
  @ApiProperty()
  siret: string;

  @Prop({ required: false })
  @ApiProperty()
  name: string;

  @Prop({ required: false })
  @ApiProperty()
  dateCreation: string;

  @Prop({ required: false })
  @ApiProperty()
  yearsInExistence: number;

  @Prop({ required: false })
  @ApiProperty()
  effective: string;

  @Prop({ required: false })
  @ApiProperty()
  dateConfirmationEffectif: string;

  @Prop({ type: [RepresentativeSchema] })
  @ApiProperty()
  representatives: EntrepriseRepresentativeEntity[];

  @Prop({ type: [LocationSchema] })
  @ApiProperty()
  location: LocationEntrepriseEntity;

  @Prop({ required: false })
  @ApiProperty()
  shareCapital: string;

  @Prop({ type: [FinanceSchema] })
  @ApiProperty()
  financeDetails: FinanceEntrepriseEntity[];

  @Prop({ required: false })
  @ApiProperty()
  lastDataSources: string;

  @Prop({ required: false })
  @ApiProperty()
  created: Date;

  @Prop({ required: false })
  @ApiProperty()
  updated: Date;
}

export const EntrepriseSchema = SchemaFactory.createForClass(Entreprise);
