import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../common/Services/event.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventSelectDTO } from '../../common/model/api.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit, OnChanges {
  @Input() citySlug: string | null = null;
  events$!: Observable<EventSelectDTO[]>;
  categories = ['All', 'Movies', 'Music', 'Sports', 'Comedy'];
  activeCategory = 'All';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents(this.citySlug ?? this.getStoredCitySlug());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('citySlug' in changes) {
      this.loadEvents(this.citySlug ?? this.getStoredCitySlug());
    }
  }

  setCategory(category: string): void {
    this.activeCategory = category;
    // Filter logic can be added here if the API support categories
  }

  private loadEvents(citySlug: string): void {
    this.events$ = citySlug
      ? this.eventService.getEventByCitySlug(citySlug)
      : this.eventService.getEvents();
  }

  private getStoredCitySlug(): string {
    try {
      const raw = localStorage.getItem('selectedCity');
      if (!raw) return '';
      const parsed = JSON.parse(raw);
      return typeof parsed?.slug === 'string' ? parsed.slug : '';
    } catch {
      return '';
    }
  }
}
