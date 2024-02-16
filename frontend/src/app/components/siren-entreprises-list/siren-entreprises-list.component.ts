import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';
import { SireneEntreprise } from 'src/app/shared/types/sirene-entreprise.type';

@Component({
  selector: 'app-siren-entreprises-list',
  templateUrl: './siren-entreprises-list.component.html',
  styleUrls: ['./siren-entreprises-list.component.css'],
})
export class SirenEntreprisesListComponent {

  private _sireneEntreprises: SireneEntreprise[];
  private _currentSireneEntreprisesToShow: SireneEntreprise[];
  private _pageSize;
  private _isLoading :boolean;




  constructor(private _entrepriseService: EntrepriseService,

    private router: Router) {

    this._sireneEntreprises = [];
    this._currentSireneEntreprisesToShow = [];
    this._pageSize = 10;
    this._isLoading = true;

  }


  onPageChange($event: any) {
    this._currentSireneEntreprisesToShow = this._sireneEntreprises.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }

  @Input() set sireneEntreprises(e) {
    this._sireneEntreprises = e
    this._currentSireneEntreprisesToShow = this._sireneEntreprises.slice(0, this._pageSize);
  }

  get currenSireneEntreprisesToShow() {
    return this._currentSireneEntreprisesToShow;
  }

  get sireneEntreprises() {
    return this._sireneEntreprises;
  }

  get pageSize() {
    return this._pageSize;
  }

  onScrapEntreprise(sireneEntreprise: SireneEntreprise) {

    this._entrepriseService.scrapOneWithPappers(sireneEntreprise).
      subscribe(
        _ => {
          this.router.navigate(['/entreprise', sireneEntreprise.siren]);
        }
      );
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }
}
