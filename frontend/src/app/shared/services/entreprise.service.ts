import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise } from '../types/entreprise.type';
import { environment } from '../../../environments/environment';

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

  scrapSirene() {
    return this._http.put<Entreprise[]>(
      `${this._apiUrl}/sirene`,
      {
        entreprises: ['33841110100029', '43929893600055', '91834707100014'],
      },
      this._options()
    );
  }

  scrapPappers() {
    return this._http.put<void>(
      `${this._apiUrl}/entreprise/scraping/pappers`,
      {
        ids: 'sarl-favata-338411101,bati-france-57-851900654,lenninger-arthur-918347071',
      },
      this._options()
    );
  }

  scrapSociete() {
    return this._http.put<void>(
      `${this._apiUrl}/societe`,
      {
        entreprises:
          'sarl-favata-338411101,bati-france-57-851900654,lenninger-arthur-918347071',
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
