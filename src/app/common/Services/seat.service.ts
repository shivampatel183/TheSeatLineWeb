import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import { SeatSelectDTO } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  constructor(private apiService: ApiService) {}

  getSeatsByEventId(eventId: string): Observable<SeatSelectDTO[]> {
    return this.apiService.get<SeatSelectDTO[]>(`/seat/event/${eventId}`).pipe(
      map(response => response.data)
    );
  }
}
