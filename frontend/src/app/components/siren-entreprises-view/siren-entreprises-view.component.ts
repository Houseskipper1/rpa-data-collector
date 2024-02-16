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
  private _isLoading: boolean;

  constructor(private _sireneEntrepriseService: SireneEntrepriseService) {
    this._sireneEntreprises = [];
    this._isLoading = false;
  }

  ngOnInit(): void {
    this._isLoading = true;
    this._sireneEntrepriseService.getSireneEntreprises().subscribe((sireneEntreprises) => {
      this._sireneEntreprises = sireneEntreprises;
      this._isLoading = false;
    })
  }

  get sireneEntreprises() {
    return this._sireneEntreprises;
  }

  get isLoading(){
    return this._isLoading;
  }
}
