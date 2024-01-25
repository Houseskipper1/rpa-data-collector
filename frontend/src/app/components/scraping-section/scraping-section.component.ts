import { Component } from '@angular/core';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';

@Component({
  selector: 'app-search-section',
  templateUrl: './scraping-section.component.html',
  styleUrls: [],
})
export class ScrapingSectionComponent {

  constructor(private _entrepriseService: EntrepriseService){}

  rien(): void {
    console.log('rien');
  }

  scrapSirene(){
    this._entrepriseService.scrapSirene().subscribe({
      next: (res) => alert("Scarping de Sirene réussis"),
      error: (res) => alert("Erreur lors du scraping de Sirene")
    });
  }

  vrai(): boolean {
    return true;
  }
}
