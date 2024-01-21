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
  dateCreation: string;
  yearsInExistence: number;
  effective: string;
  dateConfirmationEffectif: string;
  representatives: Representative[];
  __v: number;
};
