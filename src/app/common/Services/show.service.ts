import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import { ShowSelectDTO, EventShowListDTO } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  constructor(private apiService: ApiService) {}

  getShowsByEventId(eventId: string): Observable<EventShowListDTO[]> {
    return this.apiService
      .get<EventShowListDTO[]>(`/EventShow/event/${eventId}`)
      .pipe(map((response) => response.data));
  }
}
