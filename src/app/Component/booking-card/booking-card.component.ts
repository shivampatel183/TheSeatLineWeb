import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingResponseDto } from '../../common/model/api.model';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent {
  @Input() booking!: BookingResponseDto;

  getStatusClass(): string {
    switch (this.booking.status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getSeatNumbers(): string {
    if (!this.booking?.seats || this.booking.seats.length === 0) {
      return 'N/A';
    }
    return this.booking.seats.map((s) => s.seatId).join(', ');
  }
}
