import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema({ collection: 'sireneEntreprises' })
export class SireneEntreprise extends Document {
  @Prop({ required: false })
  @ApiProperty()
  id: string;

  @Prop({ required: true, index: true })
  @ApiProperty()
  siren: string;

  @Prop({ required: true })
  @ApiProperty()
  nic: string;

  @Prop({ required: true })
  @ApiProperty()
  naf: string;

  @Prop({ required: false })
  @ApiProperty()
  name: string;

  @Prop({ required: false })
  @ApiProperty()
  address: string;

  @Prop({ required: false })
  @ApiProperty()
  city: string;

  @Prop({ required: false })
  @ApiProperty()
  postalCode: string;

  @Prop({ required: false })
  @ApiProperty()
  latitude: number;

  @Prop({ required: false })
  @ApiProperty()
  longitude: number;
}

export const SireneEntrepriseSchema = SchemaFactory.createForClass(SireneEntreprise);
