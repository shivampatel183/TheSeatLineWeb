import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.services';
import { ApiResponse } from '../components/model/authmodel';
import {
  Booking,
  BookingListResponse,
  CreateBookingRequest,
  BookingResponse,
} from '../model/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private apiService: ApiService) {}

  // Get all bookings for the current user
  getMyBookings(): Observable<ApiResponse<Booking[]>> {
    return this.apiService.get<ApiResponse<Booking[]>>('/Booking/user');
  }

  // Get a specific booking by ID
  getBookingById(id: number): Observable<ApiResponse<Booking>> {
    return this.apiService.get<ApiResponse<Booking>>(`/Booking/${id}`);
  }

  // Create a new booking
  createBooking(
    data: CreateBookingRequest,
  ): Observable<ApiResponse<BookingResponse>> {
    return this.apiService.post<ApiResponse<BookingResponse>>(
      '/Booking',
      data,
    );
  }

  // Cancel a booking
  cancelBooking(id: number): Observable<ApiResponse<string>> {
    return this.apiService.post<ApiResponse<string>>(
      `/Booking/${id}/cancel`,
      {},
    );
  }

  // Get upcoming bookings
  getUpcomingBookings(): Observable<ApiResponse<Booking[]>> {
    return this.apiService.get<ApiResponse<Booking[]>>(
      '/Booking/my-bookings/upcoming',
    );
  }

  // Get past bookings
  getPastBookings(): Observable<ApiResponse<Booking[]>> {
    return this.apiService.get<ApiResponse<Booking[]>>(
      '/Booking/my-bookings/past',
    );
  }

  // Get cancelled bookings
  getCancelledBookings(): Observable<ApiResponse<Booking[]>> {
    return this.apiService.get<ApiResponse<Booking[]>>(
      '/Booking/my-bookings/cancelled',
    );
  }
}
