import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';
import { Entreprise } from 'src/app/shared/types/entreprise.type';

@Component({
  selector: 'app-scraping-entreprises-list',
  templateUrl: './scraping-entreprises-list.component.html',
  styleUrls: [],
})
export class ScrapingEntreprisesListComponent implements OnInit {
  private _entreprises: Entreprise[];
  private _currentEntreprisesToShow: Entreprise[];
  private _pageSize;

  constructor(
    private _entrepriseService: EntrepriseService,
    private router: Router
  ) {
    this._entreprises = [];
    this._currentEntreprisesToShow = [];
    this._pageSize = 10;
  }

  ngOnInit(): void {
    this._entrepriseService.getEntreprises().subscribe((entreprises) => {
      this._entreprises = entreprises;
      this._currentEntreprisesToShow = this._entreprises.slice(
        0,
        this._pageSize
      );
    });
  }

  onPageChange($event: any) {
    this._currentEntreprisesToShow = this._entreprises.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }

  get currentEntreprisesToShow() {
    return this._currentEntreprisesToShow;
  }

  get entreprises() {
    return this._entreprises;
  }

  get pageSize() {
    return this._pageSize;
  }

  onScrapEntreprise(entreprise : Entreprise,forceScraping :number) {
   this._entrepriseService.scrapOneWithPappersSimple(entreprise,forceScraping).
   subscribe(
    (data) => {
      this.router.navigate(['/entreprise', entreprise.siren]);
    }
   );

  }
}
