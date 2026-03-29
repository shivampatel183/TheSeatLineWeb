import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventService } from '../../common/Services/event.service';
import { ShowService } from '../../common/Services/show.service';
import { TicketCategoryService } from '../../common/Services/ticket-category.service';
import { BookingService } from '../../common/Services/booking.service';
import { ToastService } from '../../common/Services/toast.service';
import { PreloaderComponent } from '../../common/components/preloader/preloader.component';
import {
  CreateCategoryBookingRequest,
  EventSelectDTO,
  EventShowListDTO,
  TicketCategoryDTO,
} from '../../common/model/api.model';

interface SelectedCategorySummary {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

import { SeatLayoutComponent } from '../../Component/seat-layout/seat-layout.component';

@Component({
  selector: 'app-show-booking',
  standalone: true,
  imports: [CommonModule, RouterLink, PreloaderComponent],
  templateUrl: './show-booking.component.html',
  styleUrl: './show-booking.component.scss',
})
export class ShowBookingComponent implements OnInit {
  event: EventSelectDTO | null = null;
  show: EventShowListDTO | null = null;
  ticketCategories: TicketCategoryDTO[] = [];
  quantities: Record<string, number> = {};
  activeCategoryId: string | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = 'Unable to load booking details. Please try again.';
  eventId: string | null = null;
  showId: string | null = null;
  currentSlug: string | null = null;
  readonly MAX_TICKETS = 10;
  isSubmitting = false;

  // Seat Layout State
  seats: any[] = [];
  onSeatsSelected(selected: any[]): void {
    // Placeholder for seat selection logic
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private showService: ShowService,
    private ticketCategoryService: TicketCategoryService,
    private bookingService: BookingService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.showId = this.route.snapshot.paramMap.get('showId');
    this.currentSlug = this.route.snapshot.paramMap.get('slug');

    if (!this.eventId || !this.showId) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.loadBookingData(this.eventId, this.showId);
  }

  loadBookingData(eventId: string, showId: string): void {
    forkJoin({
      event: this.eventService.getEventById(eventId),
      shows: this.showService.getShowsByEventId(eventId),
      categories:
        this.ticketCategoryService.getTicketCategoriesByEventShowId(showId),
    }).subscribe({
      next: ({ event, shows, categories }) => {
        this.event = event;
        this.show = shows.find((item) => item.id === showId) || null;
        this.ticketCategories = [...categories].sort(
          (a, b) => a.price - b.price,
        );
        this.isLoading = false;

        if (!this.show) {
          this.hasError = true;
          this.errorMessage = 'The selected show could not be found.';
        }
      },
      error: (error) => {
        console.error('Error loading show booking data:', error);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  get eventSlug(): string | null {
    return this.event?.slug || this.currentSlug;
  }

  get formattedShowDate(): string {
    if (!this.show?.startDateTime) {
      return '';
    }

    return new Date(this.show.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  get timeRange(): string {
    if (!this.show?.startDateTime || !this.show?.endDateTime) {
      return '';
    }

    return `${this.formatTime(this.show.startDateTime)} - ${this.formatTime(this.show.endDateTime)}`;
  }

  formatTime(value: string): string {
    return new Date(value).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  getAvailableTickets(category: TicketCategoryDTO): number {
    return Math.max(category.totalQuantity - category.soldQuantity, 0);
  }

  getQuantity(categoryId: string): number {
    return this.quantities[categoryId] || 0;
  }

  isCategoryLocked(categoryId: string): boolean {
    return (
      this.activeCategoryId !== null && this.activeCategoryId !== categoryId
    );
  }

  decrement(category: TicketCategoryDTO): void {
    const nextValue = Math.max(this.getQuantity(category.id) - 1, 0);
    this.quantities = {
      ...this.quantities,
      [category.id]: nextValue,
    };

    if (nextValue === 0) {
      this.activeCategoryId = null;
    }
  }

  increment(category: TicketCategoryDTO): void {
    if (this.isCategoryLocked(category.id)) {
      this.toast.warning(
        'You can only select tickets from one category at a time',
      );
      return;
    }

    const current = this.getQuantity(category.id);
    const available = this.getAvailableTickets(category);

    if (this.totalSelectedTickets >= this.MAX_TICKETS) {
      this.toast.warning(
        `Maximum ${this.MAX_TICKETS} tickets allowed per booking`,
      );
      return;
    }

    if (current >= available) {
      return;
    }

    this.activeCategoryId = category.id;
    this.quantities = {
      ...this.quantities,
      [category.id]: current + 1,
    };
  }

  get selectedCategories(): SelectedCategorySummary[] {
    return this.ticketCategories
      .filter((category) => this.getQuantity(category.id) > 0)
      .map((category) => ({
        id: category.id,
        name: category.name,
        quantity: this.getQuantity(category.id),
        price: category.price,
      }));
  }

  get totalSelectedTickets(): number {
    return this.selectedCategories.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
  }

  get totalAmount(): number {
    return this.selectedCategories.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
  }

  get hasSelection(): boolean {
    return this.totalSelectedTickets > 0;
  }

  continueToSeatLayout(): void {
    if (!this.hasSelection || !this.showId || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const request: CreateCategoryBookingRequest = {
      eventShowId: this.showId,
      selections: this.selectedCategories.map((cat) => ({
        ticketCategoryId: cat.id,
        quantity: cat.quantity,
      })),
    };

    this.bookingService.createCategoryBooking(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.data) {
          this.router.navigate(
            [
              '/event',
              this.eventSlug,
              this.eventId,
              'shows',
              this.showId,
              'review',
            ],
            {
              state: {
                booking: response.data,
                holdMessage: response.message || '',
              },
            },
          );
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg =
          err?.error?.message || 'Failed to hold tickets. Please try again.';
        this.toast.error(msg);
      },
    });
  }
}
