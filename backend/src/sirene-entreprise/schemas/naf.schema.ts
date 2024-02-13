import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ collection: 'naf' })
export class Naf extends Document {
  @Prop({ required: false })
  id: string;

  @Prop({required: true})
  code: string;

  @Prop({required: true})
  desc: string;

}

export const NafSchema = SchemaFactory.createForClass(Naf);
