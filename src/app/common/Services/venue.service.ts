import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';

export interface VenueDetailDTO {
  id: string;
  name: string;
  cityName: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  totalCapacity?: number;
  amenities?: string[];
  accessibilityFeatures?: string[];
  mediaGallery?: string[];
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VenueService {
  constructor(private apiService: ApiService) {}

  getVenueById(id: string): Observable<VenueDetailDTO> {
    return this.apiService
      .get<VenueDetailDTO>(`/Venue/${id}`)
      .pipe(map((response) => response.data));
  }
}
