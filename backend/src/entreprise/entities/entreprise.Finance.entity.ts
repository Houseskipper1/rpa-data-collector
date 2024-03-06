import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FinanceEntrepriseEntity {
  // Année financière
  @Expose()
  @Type(() => String)
  @ApiProperty()
  financialYear: string;

  // Chiffre d'affaires
  @Expose()
  @Type(() => String)
  @ApiProperty()
  turnover: string;

  // Tendance du chiffre d'affaires
  @Expose()
  @Type(() => String)
  @ApiProperty()
  turnoverTrend: string;

  // Trésorerie
  @Expose()
  @Type(() => String)
  @ApiProperty()
  cashFlow: string;

  // Tendance de la trésorerie
  @Expose()
  @Type(() => String)
  @ApiProperty()
  cashFlowTrend: string;

  // Résultat net
  @Expose()
  @Type(() => String)
  @ApiProperty()
  netProfit: string;

  // Marge nette
  @Expose()
  @Type(() => String)
  @ApiProperty()
  netMargin: string;
}
