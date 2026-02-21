import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../common/Services/api.services';
import { firstValueFrom } from 'rxjs';
import { CitySelectorComponent } from '../../common/components/city-selector/city-selector.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CitySelectorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private readonly SELECTED_CITY_KEY = 'city';
  private readonly VISITOR_CITY_KEY = 'visitorCity';

  currentCity = 'Select city';
  availableCities: string[] = [];
  showCityPopup = false;

  constructor(private apiApiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.initializeCitySelection();
  }

  private async initializeCitySelection(): Promise<void> {
    this.availableCities = await this.fetchAvailableCities();

    const selectedCity = this.getStoredSelectedCity();
    if (selectedCity && this.isCityAvailable(selectedCity)) {
      this.setSelectedCity(selectedCity);
      return;
    }

    const visitorCity = await this.getOrDetectVisitorCity();
    if (visitorCity && this.isCityAvailable(visitorCity)) {
      this.setSelectedCity(visitorCity);
      return;
    }

    if (this.availableCities.length > 0) {
      this.showCityPopup = true;
    }
  }

  private getStoredSelectedCity(): string {
    try {
      const storedCity = localStorage.getItem(this.SELECTED_CITY_KEY);
      return storedCity?.trim() || 'Select city';
    } catch {
      return 'Select city';
    }
  }

  private async fetchAvailableCities(): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.apiApiService.get<any>(`/City`),
      );
      const sources = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.items)
          ? response.data.items
          : Array.isArray(response)
            ? response
            : [];

      const uniqueCities: string[] = Array.from(
        new Set(
          sources
            .map(
              (item: any) =>
                item?.name ||
                item?.cityName ||
                item?.city ||
                item?.venueCity ||
                item?.location?.city,
            )
            .filter(
              (city: unknown): city is string =>
                typeof city === 'string' && city.trim().length > 0,
            )
            .map((city: string) => city.trim()),
        ),
      );

      uniqueCities.sort((a: string, b: string) => a.localeCompare(b));
      return uniqueCities;
    } catch {
      return [];
    }
  }

  private async getOrDetectVisitorCity(): Promise<string> {
    const storedVisitorCity = this.getLocalStorageValue(this.VISITOR_CITY_KEY);
    if (storedVisitorCity) {
      return storedVisitorCity;
    }

    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        return '';
      }

      const data = await response.json();
      const detectedCity =
        typeof data?.city === 'string' ? data.city.trim() : '';
      if (!detectedCity) {
        return '';
      }

      localStorage.setItem(this.VISITOR_CITY_KEY, detectedCity);
      return detectedCity;
    } catch {
      return '';
    }
  }

  private getLocalStorageValue(key: string): string {
    try {
      return localStorage.getItem(key)?.trim() || '';
    } catch {
      return '';
    }
  }

  private isCityAvailable(city: string): boolean {
    return this.availableCities.some(
      (availableCity) => availableCity.toLowerCase() === city.toLowerCase(),
    );
  }

  openCityPopup(): void {
    this.showCityPopup = true;
  }

  closeCityPopup(): void {
    if (this.currentCity !== 'Select city' || this.availableCities.length === 0) {
      this.showCityPopup = false;
    }
  }

  selectCity(city: string): void {
    this.setSelectedCity(city);
    this.showCityPopup = false;
  }

  private setSelectedCity(city: string): void {
    this.currentCity = city;
    try {
      localStorage.setItem(this.SELECTED_CITY_KEY, city);
    } catch {
      // no-op when localStorage is unavailable
    }
  }
}
