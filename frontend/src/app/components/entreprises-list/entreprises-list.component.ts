import { Component, Input } from '@angular/core';
import { Entreprise } from 'src/app/shared/types/entreprise.type';

@Component({
  selector: 'app-entreprises-list',
  templateUrl: './entreprises-list.component.html',
  styleUrls: [],
})
export class EntreprisesListComponent {
  @Input() entreprises: Entreprise[];
  @Input() entrepriseSelected: Entreprise;

  constructor() {
    this.entreprises = [];
    this.entrepriseSelected = {} as Entreprise;
  }
}
