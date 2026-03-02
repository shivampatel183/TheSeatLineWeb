import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import { ShowSelectDTO } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  constructor(private apiService: ApiService) {}

  getShowsByEventId(eventId: string): Observable<ShowSelectDTO[]> {
    return this.apiService.get<ShowSelectDTO[]>(`/show/event/${eventId}`).pipe(
      map(response => response.data)
    );
  }
}
