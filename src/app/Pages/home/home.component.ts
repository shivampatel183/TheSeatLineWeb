import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../common/model/master.model';
import { ApiService } from '../../common/Services/api.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentCity = 'Select city';

  constructor(private apiApiService: ApiService) {}

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

  test() {
    this.apiApiService.get<any>(`/Venue/GetVenue`).subscribe((res) => {
      console.log(res);
    });
  }
}
