import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Entreprise } from '../types/entreprise.type';
import { environment } from '../../../environments/environment';
import { SireneEntreprise } from '../types/sirene-entreprise.type';
import { Parameter } from '../types/parameter.type';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private readonly _apiUrl: string;

  constructor(private _http: HttpClient) {
    this._apiUrl = `${environment.apiUrl}`;
  }

  getParameters(): Observable<Parameter[]> {
    return this._http.get<Parameter[]>(`${this._apiUrl}/parameters`);
  }

  update(parameter: Parameter): Observable<any> {
    return this._http.put<Parameter>(
      `${this._apiUrl}/parameters/${parameter._id}`,
      parameter,
      this._options()
    );
  }

  /**
   * Function to return request options
   */
  private _options(headerList: object = {}): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return { headers };
  }
}
