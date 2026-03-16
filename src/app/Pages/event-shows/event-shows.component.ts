import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShowService } from '../../common/Services/show.service';
import { EventService } from '../../common/Services/event.service';
import { EventShowListDTO, EventSelectDTO } from '../../common/model/api.model';
import { forkJoin } from 'rxjs';

interface GroupedShows {
  [date: string]: EventShowListDTO[];
}

@Component({
  selector: 'app-event-shows',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-shows.component.html',
  styleUrl: './event-shows.component.scss',
})
export class EventShowsComponent implements OnInit {
  shows: EventShowListDTO[] = [];
  event: EventSelectDTO | null = null;
  groupedShows: GroupedShows = {};
  sortedDates: string[] = [];
  isLoading = true;
  hasError = false;
  expandedDate: string | null = null;
  eventId: string | null = null;
  currentSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.currentSlug = this.route.snapshot.paramMap.get('slug');
    if (this.eventId) {
      this.fetchData(this.eventId);
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  fetchData(eventId: string): void {
    forkJoin({
      shows: this.showService.getShowsByEventId(eventId),
      event: this.eventService.getEventById(eventId),
    }).subscribe({
      next: (data) => {
        this.shows = data.shows;
        this.event = data.event;
        this.groupShowsByDate();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  groupShowsByDate(): void {
    this.groupedShows = this.shows.reduce((acc: GroupedShows, show) => {
      if (!show.startDateTime) return acc;

      const date = new Date(show.startDateTime);
      const dateString = date.toISOString().split('T')[0];

      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(show);
      return acc;
    }, {});

    this.sortedDates = Object.keys(this.groupedShows).sort();

    this.sortedDates.forEach((date) => {
      this.groupedShows[date].sort((a, b) => {
        if (!a.startDateTime || !b.startDateTime) return 0;
        return (
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime()
        );
      });
    });

    if (this.sortedDates.length > 0) {
      [this.expandedDate] = this.sortedDates;
    }
  }

  toggleAccordion(date: string): void {
    this.expandedDate = this.expandedDate === date ? null : date;
  }

  getShowCountForDate(date: string): number {
    return this.groupedShows[date]?.length || 0;
  }

  formatDateHeader(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1:
        return 'status-active';
      case 2:
        return 'status-sold-out';
      case 3:
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Available';
      case 2:
        return 'Sold Out';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  get formattedEventDate(): string {
    if (!this.event?.startDateTime) return '';
    return new Date(this.event.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get eventSlug(): string | null {
    return this.event?.slug || this.currentSlug;
  }

  goToBooking(show: EventShowListDTO): void {
    if (show.status !== 1) {
      return;
    }

    const eventId = this.event?.id || this.eventId;
    const slug = this.eventSlug;

    if (!eventId || !slug) {
      return;
    }

    this.router.navigate(['/event', slug, eventId, 'shows', show.id, 'book']);
  }
}
