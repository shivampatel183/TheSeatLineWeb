import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../common/model/master.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentCity = 'Select city';
  cities: City[] = [];

  ngOnInit(): void {
    this.currentCity = this.getStoredCity();
  }

  private getStoredCity(): string {
    try {
      const storedCity = localStorage.getItem('city');
      return storedCity?.trim() || 'Select city';
    } catch {
      return 'Select city';
    }
  }
}
