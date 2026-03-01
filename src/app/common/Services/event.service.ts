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
    return this.apiService.get<EventSelectDTO[]>('/event').pipe(
      map(response => response.data)
    );
  }

  getEventById(id: string): Observable<EventSelectDTO> {
    return this.apiService.get<EventSelectDTO>(`/event/${id}`).pipe(
      map(response => response.data)
    );
  }
}
