import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../common/Services/api.services';
import { firstValueFrom } from 'rxjs';
import { CitySelectorComponent } from '../../common/components/city-selector/city-selector.component';
import { EventListComponent } from '../../Component/event-list/event-list.component';
import { AvailableCity } from '../../common/model/availablecity.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CitySelectorComponent, EventListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private readonly SELECTED_CITY_KEY = 'selectedCity';
  private readonly VISITOR_CITY_KEY = 'visitorCityName';
  private readonly AVAILABLE_CITIES_KEY = 'availableCities';

  selectedCity: AvailableCity | null = null; // full city object
  availableCities: AvailableCity[] = [];
  showCityPopup = false;

  constructor(private apiApiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.initializeCitySelection();
  }

  private async initializeCitySelection(): Promise<void> {
    this.availableCities = await this.fetchAvailableCities();

    const savedCity = this.getStoredSelectedCity();
    if (savedCity && this.isCityAvailable(savedCity)) {
      this.setSelectedCity(savedCity);
      return;
    }

    const visitorCityName = await this.getOrDetectVisitorCity();
    if (visitorCityName) {
      const matchingCity = this.availableCities.find(
        (c) => c.name.toLowerCase() === visitorCityName.toLowerCase(),
      );
      if (matchingCity) {
        this.setSelectedCity(matchingCity);
        return;
      }
    }

    if (this.availableCities.length > 0) {
      this.showCityPopup = true;
    }
  }

  private getStoredSelectedCity(): AvailableCity | null {
    try {
      const stored = localStorage.getItem(this.SELECTED_CITY_KEY);
      if (!stored) return null;
      const city = JSON.parse(stored);
      if (
        city &&
        typeof city.name === 'string' &&
        typeof city.slug === 'string'
      ) {
        return city as AvailableCity;
      }
    } catch (e) {
      console.error('Error parsing stored city:', e);
    }
    return null;
  }

  private async fetchAvailableCities(): Promise<AvailableCity[]> {
    try {
      const cached = localStorage.getItem(this.AVAILABLE_CITIES_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing cached cities:', e);
    }

    try {
      const response = await firstValueFrom(
        this.apiApiService.get<any>('/City'),
      );
      const cities = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      const validCities = cities.filter(
        (c: any) =>
          c && typeof c.name === 'string' && typeof c.slug === 'string',
      ) as AvailableCity[];

      validCities.sort((a, b) => a.name.localeCompare(b.name));

      if (validCities.length > 0) {
        localStorage.setItem(
          this.AVAILABLE_CITIES_KEY,
          JSON.stringify(validCities),
        );
      }

      return validCities;
    } catch (error) {
      console.error('Failed to fetch cities', error);
      return [];
    }
  }

  private async getOrDetectVisitorCity(): Promise<string> {
    const stored = this.getLocalStorageValue(this.VISITOR_CITY_KEY);
    if (stored) return stored;

    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) return '';
      const data = await response.json();
      const city = typeof data?.city === 'string' ? data.city.trim() : '';
      if (city) {
        localStorage.setItem(this.VISITOR_CITY_KEY, city);
      }
      return city;
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

  private isCityAvailable(city: AvailableCity): boolean {
    return this.availableCities.some((c) => c.slug === city.slug);
  }

  openCityPopup(): void {
    this.showCityPopup = true;
  }

  closeCityPopup(): void {
    if (this.selectedCity !== null || this.availableCities.length === 0) {
      this.showCityPopup = false;
    }
  }

  selectCity(city: AvailableCity): void {
    this.setSelectedCity(city);
    this.showCityPopup = false;
  }

  private setSelectedCity(city: AvailableCity): void {
    this.selectedCity = city;
    try {
      localStorage.setItem(this.SELECTED_CITY_KEY, JSON.stringify(city));
    } catch (e) {
      console.error('Could not save selected city', e);
    }
  }

  get availableCityNames(): string[] {
    return this.availableCities.map((c) => c.name);
  }

  selectCityByName(cityName: string): void {
    const city = this.availableCities.find((c) => c.name === cityName);
    if (city) {
      this.selectCity(city);
    }
  }
}
