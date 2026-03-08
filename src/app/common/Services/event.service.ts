import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import { EventSelectDTO } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private apiService: ApiService) {}

  getEvents(): Observable<EventSelectDTO[]> {
    return this.apiService
      .get<EventSelectDTO[]>('/Event')
      .pipe(map((response) => response.data));
  }

  getEventById(id: string): Observable<EventSelectDTO> {
    return this.apiService
      .get<EventSelectDTO>(`/Event/${id}`)
      .pipe(map((response) => response.data));
  }

  getEventByCitySlug(citySlug: string): Observable<EventSelectDTO[]> {
    return this.apiService
      .get<EventSelectDTO[]>(`/Event?CitySlug=${encodeURIComponent(citySlug)}`)
      .pipe(map((response) => response.data));
  }
}
