import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Finance extends Document {
  // Année financière
  @Prop({ required: false })
  financialYear: string;

  // Chiffre d'affaires
  @Prop({ required: false })
  turnover: String;

  // Tendance du chiffre d'affaires
  @Prop({ required: false })
  turnoverTrend: string;

  // Trésorerie
  @Prop({ required: false })
  cashFlow: String;

  // Tendance de la trésorerie
  @Prop({ required: false })
  cashFlowTrend: string;

  // Résultat net
  @Prop({ required: false })
  netProfit: String;

  // Marge nette
  @Prop({ required: false })
  netMargin: String;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
