import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowSelectDTO } from '../../common/model/api.model';

@Component({
  selector: 'app-show-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-item.component.html',
  styleUrl: './show-item.component.scss'
})
export class ShowItemComponent {
  @Input() show!: ShowSelectDTO;

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
