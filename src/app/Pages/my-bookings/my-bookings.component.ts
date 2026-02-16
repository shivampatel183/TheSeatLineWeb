import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../common/Services/booking.service';
import { ToastService } from '../../common/Services/toast.service';
import { Booking, BookingStatus } from '../../common/model/booking.model';
import { BookingCardComponent } from '../../Component/booking-card/booking-card.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, BookingCardComponent],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  isLoading = false;
  activeFilter: 'all' | 'upcoming' | 'past' | 'cancelled' = 'all';

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
      next: (response) => {
        if (response.success && response.data) {
          this.bookings = response.data;
          this.applyFilter();
        } else {
          this.toast.error('Failed to load bookings');
        }
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Error loading bookings');
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: 'all' | 'upcoming' | 'past' | 'cancelled'): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    const now = new Date();

    switch (this.activeFilter) {
      case 'upcoming':
        this.filteredBookings = this.bookings.filter(
          (b) =>
            new Date(b.show?.showDate || b.bookingDate) >= now &&
            b.status === BookingStatus.Confirmed,
        );
        break;
      case 'past':
        this.filteredBookings = this.bookings.filter(
          (b) =>
            new Date(b.show?.showDate || b.bookingDate) < now ||
            b.status === BookingStatus.Completed,
        );
        break;
      case 'cancelled':
        this.filteredBookings = this.bookings.filter(
          (b) => b.status === BookingStatus.Cancelled,
        );
        break;
      default:
        this.filteredBookings = [...this.bookings];
    }
  }

  onBookingCancelled(bookingId: number): void {
    this.loadBookings();
  }

  getBookingCount(filter: string): number {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return this.bookings.filter(
          (b) =>
            new Date(b.show?.showDate || b.bookingDate) >= now &&
            b.status === BookingStatus.Confirmed,
        ).length;
      case 'past':
        return this.bookings.filter(
          (b) =>
            new Date(b.show?.showDate || b.bookingDate) < now ||
            b.status === BookingStatus.Completed,
        ).length;
      case 'cancelled':
        return this.bookings.filter((b) => b.status === BookingStatus.Cancelled)
          .length;
      default:
        return this.bookings.length;
    }
  }
}
