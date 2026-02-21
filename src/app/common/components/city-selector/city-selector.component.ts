import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.css'],
})
export class CitySelectorComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() cities: string[] = [];
  @Input() canClose = true;

  @Output() closeRequested = new EventEmitter<void>();
  @Output() citySelected = new EventEmitter<string>();

  searchTerm = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue) {
      this.searchTerm = '';
    }
  }

  get filteredCities(): string[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.cities;
    }

    return this.cities.filter((city) =>
      city.toLowerCase().includes(term),
    );
  }

  requestClose(): void {
    if (!this.canClose) {
      return;
    }
    this.closeRequested.emit();
  }

  selectCity(city: string): void {
    this.citySelected.emit(city);
  }
}
