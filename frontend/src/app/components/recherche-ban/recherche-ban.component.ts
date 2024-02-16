import { Component } from '@angular/core';
import { SireneEntrepriseService } from 'src/app/shared/services/sirene-entreprise.service';
import { SireneEntreprise } from 'src/app/shared/types/sirene-entreprise.type';

@Component({
  selector: 'app-recherche-ban',
  templateUrl: './recherche-ban.component.html',
  styleUrls: ['./recherche-ban.component.css'],
})
export class RechercheBanComponent {
  private _range: number;
  private _address: String;

  private _entreprises: SireneEntreprise[];

  constructor(private _sireneEntrepriseService: SireneEntrepriseService) {
    this._range = 0;
    this._address = "";

    this._entreprises = [];
  }

  ngOnInit(): void {
  }

  formatLabel(value: number): string {
    return `${value}km`;
  }

  search() {
    this._sireneEntrepriseService.searchBan(this._address, this._range).subscribe((entreprises) => {
      this._entreprises = entreprises;
    })
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
}
