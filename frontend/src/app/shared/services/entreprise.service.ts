import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
