import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';
import { Entreprise } from 'src/app/shared/types/entreprise.type';

@Component({
  selector: 'app-entreprises-section',
  templateUrl: './entreprises-section.component.html',
  styleUrls: [],
})
export class EntrepriseSectionComponent implements OnInit {
  private _entreprises: Entreprise[];
  private _entreprisesSelected: Entreprise;

  constructor(private _entrepriseService: EntrepriseService) {
    this._entreprises = [];
    this._entreprisesSelected = {} as Entreprise;
  }

  ngOnInit(): void {
    this._entrepriseService.getEntreprises().subscribe((entreprises) => {
      this._entreprises = entreprises;
    });
  }

  get entreprises(): Entreprise[] {
    return this._entreprises;
  }

  get entreprisesSelected(): Entreprise {
    return this._entreprisesSelected;
  }

  set entreprisesSelected(entreprise: Entreprise) {
    this._entreprisesSelected = entreprise;
  }

  isEntrepriseSelected(entreprise: Entreprise): boolean {
    return this._entreprisesSelected === entreprise;
  }
}
