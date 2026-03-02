import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../common/Services/event.service';
import { ShowService } from '../../common/Services/show.service';
import { EventSelectDTO, ShowSelectDTO } from '../../common/model/api.model';
import { ShowItemComponent } from '../../Component/show-item/show-item.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ShowItemComponent, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent implements OnInit {
  event!: EventSelectDTO;
  shows: ShowSelectDTO[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private showService: ShowService,
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      forkJoin({
        event: this.eventService.getEventById(eventId),
        shows: this.showService.getShowsByEventId(eventId),
      }).subscribe({
        next: (data) => {
          this.event = data.event;
          this.shows = data.shows;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading event data', err);
          this.isLoading = false;
        },
      });
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
}
