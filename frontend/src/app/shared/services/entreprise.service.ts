import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise } from '../types/entreprise.type';
import { environment } from '../../../environments/environment';
import { SireneEntreprise } from '../types/sirene-entreprise.type';

@Injectable({
  providedIn: 'root',
})
export class EntrepriseService {
  private readonly _apiUrl: string;

  constructor(private _http: HttpClient) {
    this._apiUrl = `${environment.apiUrl}`;
  }

  getEntreprises(): Observable<Entreprise[]> {
    return this._http.get<Entreprise[]>(`${this._apiUrl}/entreprise`);
  }

  getEntreprisesBySiren(siren: string): Observable<Entreprise> {
    return this._http.get<Entreprise>(
      `${this._apiUrl}/entreprise/siren/` + siren
    );
  }

  scrapSirene() {
    return this._http.put<Entreprise[]>(
      `${this._apiUrl}/scraping/sirene`,
      {
        entreprises: [
          '33841110100029',
          '85190065400019',
          '91834707100014',
          '34827919100012',
        ],
      },
      this._options()
    );
  }

  scrapOneWithPappers(sireneEntreprises: SireneEntreprise,forceScraping : number) {
    return this._http.put<void>(
      `${this._apiUrl}/scraping/pappers/`+sireneEntreprises.siren+'?forceScraping='+forceScraping,
      this._options()
    );
  }

  scrapOneWithPappersSimple(entreprise: Entreprise,forceScraping : number) {
    return this._http.put<void>(
      `${this._apiUrl}/scraping/pappers/`+entreprise.siren+'?forceScraping='+forceScraping,
      this._options()
    );
  }

  scrapPappers() {
    return this._http.put<void>(
      `${this._apiUrl}/scraping/pappers`,
      {
        ids: 'sarl-favata-338411101,bati-france-57-851900654,lenninger-arthur-918347071,grosjean-et-fils-348279191',
      },
      this._options()
    );
  }

  scrapSociete() {
    return this._http.put<void>(
      `${this._apiUrl}/scraping/societe`,
      {
        entreprises:
          'sarl-favata-338411101,bati-france-57-851900654,lenninger-arthur-918347071,grosjean-et-fils-348279191',
      },
      this._options()
    );
  }

  jsonExport() {
    return this._http.get<void>(`${this._apiUrl}/jsonExport`, this._options());
  }

  private _options(headerList: object = {}): any {
    return {
      headers: new HttpHeaders(
        Object.assign({ 'Content-Type': 'application/json' }, headerList)
      ),
    };
  }
}
