import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../common/Services/booking.service';
import { ToastService } from '../../common/Services/toast.service';
import { BookingResponseDto } from '../../common/model/api.model';
import { BookingCardComponent } from '../../Component/booking-card/booking-card.component';
import { PreloaderComponent } from '../../common/components/preloader/preloader.component';
import { BookingTicketsModalComponent } from '../../Component/booking-tickets-modal/booking-tickets-modal.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    BookingCardComponent,
    PreloaderComponent,
    BookingTicketsModalComponent,
  ],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  activeFilter: 'all' | 'pending' | 'confirmed' = 'all';
  isLoading = false;
  activeBookingIdForTickets: string | null = null;

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
        // Only show Pending + Confirmed bookings for now
        this.bookings = (data ?? []).filter((b) =>
          ['pending', 'confirmed'].includes((b.status ?? '').toLowerCase()),
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.toast.error('Failed to load bookings');
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: 'all' | 'pending' | 'confirmed'): void {
    this.activeFilter = filter;
  }

  get filteredBookings(): BookingResponseDto[] {
    return this.bookings.filter((b) => this.matchesFilter(b, this.activeFilter));
  }

  getBookingCount(filter: 'all' | 'pending' | 'confirmed'): number {
    return this.bookings.filter((b) => this.matchesFilter(b, filter)).length;
  }

  openTickets(bookingId: string): void {
    this.activeBookingIdForTickets = bookingId;
  }

  closeTickets(): void {
    this.activeBookingIdForTickets = null;
  }

  private matchesFilter(
    booking: BookingResponseDto,
    filter: 'all' | 'pending' | 'confirmed',
  ): boolean {
    if (filter === 'all') return true;

    const status = (booking.status ?? '').toLowerCase();
    return status === filter;
  }
}
