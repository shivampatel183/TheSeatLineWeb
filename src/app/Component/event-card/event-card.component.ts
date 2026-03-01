import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventSelectDTO } from '../../common/model/api.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  @Input() event!: EventSelectDTO;

  get formattedDate(): string {
    if (!this.event?.startDateTime) return '';
    return new Date(this.event.startDateTime).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  get formattedTime(): string {
    if (!this.event?.startDateTime) return '';
    return new Date(this.event.startDateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
