import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';
import { SireneEntrepriseService } from 'src/app/shared/services/sirene-entreprise.service';
import { SireneEntreprise } from 'src/app/shared/types/sirene-entreprise.type';

@Component({
  selector: 'app-siren-entreprises-list',
  templateUrl: './siren-entreprises-list.component.html',
  styleUrls: ['./siren-entreprises-list.component.css'],
})
export class SirenEntreprisesListComponent implements OnInit {

  private _sireneEntreprises: SireneEntreprise[];
  private _currentSireneEntreprisesToShow: SireneEntreprise[];
  private _pageSize;
  private _isLoading :boolean;


  constructor(private _sireneEntrepriseService: SireneEntrepriseService,
              private _entrepriseService : EntrepriseService,
              private router: Router) {

    this._sireneEntreprises = [];
    this._currentSireneEntreprisesToShow = [];
    this._pageSize = 10;
    this._isLoading = true;

  }

  ngOnInit(): void {
    this._sireneEntrepriseService.getSireneEntreprises()
    .pipe(
      tap(() => {
        this._isLoading = true;
      })
    )
    .subscribe((sireneEntreprises) => {
      this._isLoading = false;
      this._sireneEntreprises = sireneEntreprises;
      this._currentSireneEntreprisesToShow = this._sireneEntreprises.slice(0, this._pageSize);
      console.log(this._currentSireneEntreprisesToShow)
    })
  }

  onPageChange($event: any) {
    this._currentSireneEntreprisesToShow = this._sireneEntreprises.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
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

  onScrapEntreprise(sireneEntreprise : SireneEntreprise) {

   this._entrepriseService.scrapOneWithPappers(sireneEntreprise).
   subscribe(
    (data) => {
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
