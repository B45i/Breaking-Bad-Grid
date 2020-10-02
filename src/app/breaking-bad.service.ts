import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ICharactor } from './model';

@Injectable({
  providedIn: 'root',
})
export class BreakingBadService {
  private readonly baseURL = 'https://www.breakingbadapi.com/api/';
  constructor(private http: HttpClient) {}

  getCharacters(limit = 15, offset = 0): Observable<Array<ICharactor>> {
    return this.http.get<Array<ICharactor>>(
      `${this.baseURL}characters?limit=${limit}&offset=${offset}`
    );
  }
}
