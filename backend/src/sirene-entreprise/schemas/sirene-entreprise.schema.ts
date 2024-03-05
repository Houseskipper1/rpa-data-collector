import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ collection: 'sireneEntreprises' })
export class SireneEntreprise extends Document {
  @Prop({ required: false })
  id: string;

  @Prop({ required: true, index: true })
  siren: string;

  @Prop({ required: true })
  nic: string;

  @Prop({ required: true})
  naf: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  postalCode: string;

  @Prop({ required: false })
  latitude: number;

  @Prop({ required: false })
  longitude: number;
}

export const SireneEntrepriseSchema = SchemaFactory.createForClass(SireneEntreprise);
