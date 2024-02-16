export type Location = {
  streetAddress: string;
  postalCode: string;
  city: string;
  department: string;
  departmentNumber: string;
  region: string;
  country: string;
  interventionZone: string;
  longitude: number;
  latitude: number;
  _id: string;
};

export type FinanceDetails = {
  shareCapital: string;
  financialYear: string;
  turnover: string;
  turnoverTrend: string;
  cashFlow: string;
  netProfit: string;
  netMargin: string;
  _id: string;
};

export type Representative = {
  firstName: string;
  lastName: string;
  age: number;
  position: string;
  _id: string;
};

export type Entreprise = {
  _id: string;
  siren: string;
  siret: string;
  name: string;
  shareCapital: string;
  dateCreation: string;
  yearsInExistence: number;
  effective: string;
  dateConfirmationEffectif: string;
  representatives: Representative[];
  location: Location[];
  financeDetails: FinanceDetails[];
  __v: number;
};
