import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import { BookingResponseDto, CreateBookingRequest } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private apiService: ApiService) {}

  createBooking(request: CreateBookingRequest): Observable<BookingResponseDto> {
    return this.apiService.post<BookingResponseDto>('/booking', request).pipe(
      map(response => response.data)
    );
  }

  getMyBookings(): Observable<BookingResponseDto[]> {
    return this.apiService.get<BookingResponseDto[]>('/booking/my').pipe(
      map(response => response.data)
    );
  }

  getBookingById(id: string): Observable<BookingResponseDto> {
    return this.apiService.get<BookingResponseDto>(`/booking/${id}`).pipe(
      map(response => response.data)
    );
  }
}
