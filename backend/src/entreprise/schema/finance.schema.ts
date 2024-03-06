import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Finance extends Document {
  // Année financière
  @Prop({ required: false })
  @ApiProperty()
  financialYear: string;

  // Chiffre d'affaires
  @Prop({ required: false })
  @ApiProperty()
  turnover: String;

  // Tendance du chiffre d'affaires
  @Prop({ required: false })
  @ApiProperty()
  turnoverTrend: string;

  // Trésorerie
  @Prop({ required: false })
  @ApiProperty()
  cashFlow: String;

  // Tendance de la trésorerie
  @Prop({ required: false })
  @ApiProperty()
  cashFlowTrend: string;

  // Résultat net
  @Prop({ required: false })
  @ApiProperty()
  netProfit: String;

  // Marge nette
  @Prop({ required: false })
  @ApiProperty()
  netMargin: String;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
