import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class FinanceEntrepriseEntity {
  // Capital social
  @Expose()
  @Type(() => String)
  shareCapital: string;

  // Année financière
  @Expose()
  @Type(() => String)
  financialYear: string;

  // Chiffre d'affaires
  @Expose()
  @Type(() => String)
  turnover: string;

  // Tendance du chiffre d'affaires
  @Expose()
  @Type(() => String)
  turnoverTrend: string;

  // Trésorerie
  @Expose()
  @Type(() => String)
  cashFlow: string;

  // Tendance de la trésorerie
  @Expose()
  @Type(() => String)
  cashFlowTrend: string;

  // Résultat net
  @Expose()
  @Type(() => String)
  netProfit: string;

  // Marge nette
  @Expose()
  @Type(() => String)
  netMargin: string;
}
