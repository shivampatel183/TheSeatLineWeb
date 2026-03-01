import { Component, OnInit } from '@angular/core';
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
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  events$!: Observable<EventSelectDTO[]>;
  categories = ['All', 'Movies', 'Music', 'Sports', 'Comedy'];
  activeCategory = 'All';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getEvents();
  }

  setCategory(category: string): void {
    this.activeCategory = category;
    // Filter logic can be added here if the API support categories
  }
}
