import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Location extends Document {
  @Prop({ required: false })
  streetAddress: string;

  @Prop({ required: false })
  postalCode: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  department: string;

  @Prop({ required: false })
  departmentNumber: string;

  @Prop({ required: false })
  region: string;

  @Prop({ required: false })
  country: string;
  
  @Prop({ required: false })
  interventionZone: string;

  @Prop({ required: false })
  longitude: number;

  @Prop({ required: false })
  latitude: number;
}

export const LocationSchema =
  SchemaFactory.createForClass(Location);
