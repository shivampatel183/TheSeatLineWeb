import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import {
  ApiResponse,
  BookingInitResponseDto,
  BookingResponseDto,
  BookingTicketsResponseDto,
  CreateBookingRequest,
  CreateCategoryBookingRequest,
} from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private apiService: ApiService) {}

  createBooking(request: CreateBookingRequest): Observable<BookingResponseDto> {
    return this.apiService
      .post<BookingResponseDto>('/booking', request)
      .pipe(map((response) => response.data));
  }

  createCategoryBooking(
    request: CreateCategoryBookingRequest,
  ): Observable<ApiResponse<BookingInitResponseDto>> {
    return this.apiService.post<BookingInitResponseDto>(
      '/Booking/category-booking',
      request,
    );
  }

  getMyBookings(): Observable<BookingResponseDto[]> {
    return this.apiService
      .get<BookingResponseDto[]>('/booking/my')
      .pipe(map((response) => response.data));
  }

  getBookingById(id: string): Observable<BookingResponseDto> {
    return this.apiService
      .get<BookingResponseDto>(`/booking/${id}`)
      .pipe(map((response) => response.data));
  }

  getBookingInit(id: string): Observable<BookingInitResponseDto> {
    return this.apiService
      .get<BookingInitResponseDto>(`/booking/${id}/init`)
      .pipe(map((response) => response.data));
  }

  getBookingTickets(id: string): Observable<BookingTicketsResponseDto> {
    return this.apiService
      .get<BookingTicketsResponseDto>(`/booking/${id}/tickets`)
      .pipe(map((response) => response.data));
  }
}
