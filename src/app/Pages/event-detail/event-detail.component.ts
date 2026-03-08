import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../common/Services/event.service';
import { EventSelectDTO, EventShowDTO } from '../../common/model/api.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent implements OnInit {
  event: EventSelectDTO | null = null;
  shows: EventShowDTO[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe({
        next: (data) => {
          this.event = data;
          this.shows = Array.isArray(data?.shows) ? data.shows : [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading event data', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  get formattedDate(): string {
    if (!this.event?.startDateTime) return '';
    return new Date(this.event.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get parsedPerformers(): string[] {
    const performers = this.event?.performers;
    if (!performers) return [];
    if (Array.isArray(performers)) return performers;
    try {
      const parsed = JSON.parse(performers);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Active';
      case 2:
        return 'Sold Out';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  formatShowDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}
