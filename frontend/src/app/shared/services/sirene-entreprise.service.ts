import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SireneEntreprise } from '../types/sirene-entreprise.type';

@Injectable({
  providedIn: 'root'
})
export class SireneEntrepriseService {

  private readonly _apiUrl: string;

  constructor(private _http: HttpClient) {
    this._apiUrl = `${environment.apiUrl}`;
  }

  getSireneEntreprises(): Observable<SireneEntreprise[]> {
    return this._http.get<SireneEntreprise[]>(`${this._apiUrl}/sireneEntreprises`);
  }
}
