import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import { TicketCategoryDTO } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class TicketCategoryService {
  constructor(private apiService: ApiService) {}

  getTicketCategoriesByEventShowId(
    eventShowId: string,
  ): Observable<TicketCategoryDTO[]> {
    return this.apiService
      .get<TicketCategoryDTO[]>(`/TicketCategory/event-show/${eventShowId}`)
      .pipe(
        map((response: any) =>
          Array.isArray(response) ? response : (response?.data ?? []),
        ),
      );
  }
}
