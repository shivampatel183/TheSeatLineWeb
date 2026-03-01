import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../common/Services/booking.service';
import { ToastService } from '../../common/Services/toast.service';
import { BookingResponseDto } from '../../common/model/api.model';
import { BookingCardComponent } from '../../Component/booking-card/booking-card.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, BookingCardComponent],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  activeFilter: 'all' | 'cancelled' = 'all';
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.toast.error('Failed to load bookings');
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: 'all' | 'cancelled'): void {
    this.activeFilter = filter;
  }

  get filteredBookings(): BookingResponseDto[] {
    if (this.activeFilter === 'cancelled') {
      return this.bookings.filter((b) => b.status === 'Cancelled');
    }
    return this.bookings;
  }

  getBookingCount(filter: 'all' | 'cancelled'): number {
    if (filter === 'cancelled') {
      return this.bookings.filter((b) => b.status === 'Cancelled').length;
    }
    return this.bookings.length;
  }
}
