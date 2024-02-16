import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EntrepriseService } from 'src/app/shared/services/entreprise.service';

@Component({
  selector: 'app-search-section',
  templateUrl: './scraping-section.component.html',
  styleUrls: [],
})
export class ScrapingSectionComponent {

  constructor(private _entrepriseService: EntrepriseService, private _router: Router) {}

  showSireneEntreprises() {
    this._router.navigate(["/sireneEntreprises"])
  }

  showScrappingEntreprises() {
    this._router.navigate(["/scrappingEntreprises"])
  }

  scrapSirene() {
    this._entrepriseService.scrapSirene().subscribe({
      next: (res) => alert('Scraping de Sirene réussis'),
      error: (res) => alert('Erreur lors du scraping de Sirene'),
    });
  }

  scrapPappers() {
    this._entrepriseService.scrapPappers().subscribe({
      next: (res) => alert('Scraping de Pappers réussis'),
      error: (res) => alert('Erreur lors du scraping de Pappers'),
    });
  }

  scrapSociete() {
    this._entrepriseService.scrapSociete().subscribe({
      next: (res) => alert('Scraping de Societe réussis'),
      error: (res) => alert('Erreur lors du scraping de Societe'),
    });
  }

  jsonExport() {
    this._entrepriseService.jsonExport().subscribe({
      next: (res) => {
        const blob = new Blob([JSON.stringify(res)], {
          type: 'application/json',
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.json';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);

        alert('Export JSON réussi');
      },
      error: (res) => {
        alert('Export JSON échoué');
      },
    });
  }
}
