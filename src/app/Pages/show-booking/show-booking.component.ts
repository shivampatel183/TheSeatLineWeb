import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventService } from '../../common/Services/event.service';
import { ShowService } from '../../common/Services/show.service';
import { TicketCategoryService } from '../../common/Services/ticket-category.service';
import { ToastService } from '../../common/Services/toast.service';
import { PreloaderComponent } from '../../common/components/preloader/preloader.component';
import {
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
  isLoading = true;
  hasError = false;
  errorMessage = 'Unable to load booking details. Please try again.';
  eventId: string | null = null;
  showId: string | null = null;
  currentSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private showService: ShowService,
    private ticketCategoryService: TicketCategoryService,
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

  decrement(category: TicketCategoryDTO): void {
    const nextValue = Math.max(this.getQuantity(category.id) - 1, 0);
    this.quantities = {
      ...this.quantities,
      [category.id]: nextValue,
    };
  }

  increment(category: TicketCategoryDTO): void {
    const current = this.getQuantity(category.id);
    const available = this.getAvailableTickets(category);

    if (current >= available) {
      return;
    }

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
    if (!this.hasSelection) {
      return;
    }

    this.toast.warning(
      'Seat layout and booking confirmation will be connected in the next step.',
    );
  }
}
