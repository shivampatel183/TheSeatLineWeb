import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingResponseDto } from '../../common/model/api.model';
import { EventService } from '../../common/Services/event.service';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent implements OnInit {
  @Input() booking!: BookingResponseDto;
  eventLink: string[] | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    if (!this.booking?.eventId) {
      return;
    }

    if (this.booking.eventSlug) {
      this.eventLink = ['/event', this.booking.eventSlug, this.booking.eventId];
      return;
    }

    this.eventService.getEventById(this.booking.eventId).subscribe({
      next: (event) => {
        if (event?.slug && event.id) {
          this.eventLink = ['/event', event.slug, event.id];
        }
      },
      error: (error) => {
        console.error('Error loading booking event details:', error);
      },
    });
  }

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
