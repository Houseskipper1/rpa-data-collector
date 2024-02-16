import { Component, OnInit } from '@angular/core';
import { SireneEntrepriseService } from 'src/app/shared/services/sirene-entreprise.service';
import { SireneEntreprise } from 'src/app/shared/types/sirene-entreprise.type';

@Component({
  selector: 'app-siren-entreprises-view',
  templateUrl: './siren-entreprises-view.component.html',
  styleUrls: ['./siren-entreprises-view.component.css'],
})
export class SirenEntreprisesViewComponent implements OnInit {

  private _sireneEntreprises: SireneEntreprise[];

  constructor(private _sireneEntrepriseService: SireneEntrepriseService) {
    this._sireneEntreprises = [];
  }

  ngOnInit(): void {
    this._sireneEntrepriseService.getSireneEntreprises().subscribe((sireneEntreprises) => {
      this._sireneEntreprises = sireneEntreprises;
    })
  }

  get sireneEntreprises() {
    return this._sireneEntreprises;
  }
}
