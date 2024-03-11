import { Component } from '@angular/core';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';
import { SireneEntrepriseService } from 'src/app/shared/services/sirene-entreprise.service';
import { SireneEntreprise } from 'src/app/shared/types/sirene-entreprise.type';

@Component({
  selector: 'app-recherche-ban',
  templateUrl: './recherche-ban.component.html',
  styleUrls: [],
})
export class RechercheBanComponent {
  private _range: number;
  private _address: String;

  private _entreprises: SireneEntreprise[];
  private _isLoading: boolean;

  constructor(private _sireneEntrepriseService: SireneEntrepriseService,
              private _entrepriseService: EntrepriseService) {
    this._range = 0;
    this._address = '';

    this._entreprises = [];
    this._isLoading = false;
  }

  ngOnInit(): void {}

  formatLabel(value: number): string {
    return `${value}km`;
  }

  search() {
    this._entreprises = []
    this._isLoading = true;
    this._sireneEntrepriseService
      .searchBan(this._address, this._range)
      .subscribe((entreprises) => {
        this._entreprises = entreprises;
        this._isLoading = false;
      });
  }

  scrapAll(){
    this._entrepriseService.scrapWithPappersSimple(this._entreprises.map(e => e.siren), 0)
                           .subscribe({next: () => alert("Les entreprises ont bien été récupérées.")})
  }

  get range(): number {
    return this._range;
  }

  set range(nRange: number) {
    this._range = nRange;
  }

  get address(): String {
    return this._address;
  }

  set address(nAddress: String) {
    this._address = nAddress;
  }

  get entreprises(): SireneEntreprise[] {
    return this._entreprises;
  }

  get isLoading() {
    return this._isLoading;
  }
}
