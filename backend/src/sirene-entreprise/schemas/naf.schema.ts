import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

@Schema({ collection: 'naf' })
export class Naf extends Document {
  @Prop({ required: false })
  @ApiProperty()
  id: string;

  @Prop({ required: true })
  @ApiProperty()
  code: string;

  @Prop({ required: true })
  @ApiProperty()
  desc: string;

}

export const NafSchema = SchemaFactory.createForClass(Naf);
