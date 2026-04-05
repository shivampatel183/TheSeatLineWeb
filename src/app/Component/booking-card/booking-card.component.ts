import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() viewTickets = new EventEmitter<string>();

  get isPending(): boolean {
    return (this.booking?.status ?? '').toLowerCase() === 'pending';
  }

  get payReviewLink(): string[] | null {
    if (!this.isPending) return null;

    const slug = this.booking?.eventSlug ?? null;
    const eventId = this.booking?.eventId ?? null;
    const showId = this.booking?.eventShowId ?? null;

    if (!slug || !eventId || !showId) return null;
    return ['/event', slug, eventId, 'shows', showId, 'review'];
  }

  get isConfirmed(): boolean {
    return (this.booking?.status ?? '').toLowerCase() === 'confirmed';
  }

  onViewTickets(): void {
    if (!this.isConfirmed) return;
    this.viewTickets.emit(this.booking.id);
  }

  getStatusClass(): string {
    switch ((this.booking?.status ?? '').toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'failed':
        return 'status-failed';
      case 'refunded':
        return 'status-refunded';
      case 'expired':
        return 'status-expired';
      default:
        return '';
    }
  }

  getSeatSummary(): string {
    const seats = this.booking?.seats ?? [];
    if (seats.length > 0) {
      return seats
        .map((s) => {
          const parts: string[] = [];
          if (s.section) parts.push(s.section);
          if (s.row) parts.push(`Row ${s.row}`);
          if (s.seatNumber) parts.push(`Seat ${s.seatNumber}`);
          return parts.length > 0 ? parts.join(' ') : s.seatId;
        })
        .join(', ');
    }

    const qty = this.booking?.totalQuantity ?? null;
    if (qty && qty > 0) {
      return `${qty} ticket${qty === 1 ? '' : 's'}`;
    }

    return 'N/A';
  }
}
