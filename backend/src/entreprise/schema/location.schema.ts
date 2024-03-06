import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Location extends Document {
  @Prop({ required: false })
  @ApiProperty()
  streetAddress: string;

  @Prop({ required: false })
  @ApiProperty()
  postalCode: string;

  @Prop({ required: false })
  @ApiProperty()
  city: string;

  @Prop({ required: false })
  @ApiProperty()
  department: string;

  @Prop({ required: false })
  @ApiProperty()
  departmentNumber: string;

  @Prop({ required: false })
  @ApiProperty()
  region: string;

  @Prop({ required: false })
  @ApiProperty()
  country: string;

  @Prop({ required: false })
  @ApiProperty()
  interventionZone: string;

  @Prop({ required: false })
  @ApiProperty()
  longitude: number;

  @Prop({ required: false })
  @ApiProperty()
  latitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
