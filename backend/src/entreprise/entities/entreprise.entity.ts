import { EntrepriseRepresentativeEntity } from './entreprise.representative.entity';



export class EntrepriseEntity {
    id: string;
    siren: string;
    siret: string;
    name : string
    dateCreation: string;
    yearsInExistence : number;
    effective: string;   
    dateConfirmationEffectif: string;   
    representatives: EntrepriseRepresentativeEntity[];
}