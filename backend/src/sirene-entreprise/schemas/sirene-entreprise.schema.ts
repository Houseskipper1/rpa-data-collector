import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ collection: 'sireneEntreprises' })
export class SireneEntreprise extends Document {
  @Prop({ required: false })
  id: string;

  @Prop({ required: true })
  siren: string;

  @Prop({ required: true })
  nic: string;

  @Prop({ required: true})
  naf: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  postalCode: number;
}

export const SireneEntrepriseSchema = SchemaFactory.createForClass(SireneEntreprise);
