import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VenueService, VenueDetailDTO } from '../../common/Services/venue.service';

@Component({
  selector: 'app-venue-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venue-detail.component.html',
  styleUrl: './venue-detail.component.scss',
})
export class VenueDetailComponent implements OnInit {
  venue: VenueDetailDTO | null = null;
  isLoading = true;
  hasError = false;
  activeGalleryIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private venueService: VenueService,
  ) {}

  ngOnInit(): void {
    const venueId = this.route.snapshot.paramMap.get('id');
    if (venueId) {
      this.venueService.getVenueById(venueId).subscribe({
        next: (data) => {
          this.venue = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading venue data', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  get fullAddress(): string {
    if (!this.venue) return '';
    const parts = [
      this.venue.addressLine1,
      this.venue.addressLine2,
      this.venue.cityName,
      this.venue.postalCode,
    ].filter(Boolean);
    return parts.join(', ');
  }

  get galleryImages(): string[] {
    if (!this.venue?.mediaGallery) return [];
    // Handle comma-separated URLs within array items
    return this.venue.mediaGallery.flatMap(item => item.split(',').map(url => url.trim()).filter(Boolean));
  }

  get mapUrl(): string {
    if (!this.venue?.latitude || !this.venue?.longitude) return '';
    return `https://www.google.com/maps?q=${this.venue.latitude},${this.venue.longitude}`;
  }

  setActiveImage(index: number): void {
    this.activeGalleryIndex = index;
  }

  nextImage(): void {
    if (this.galleryImages.length > 0) {
      this.activeGalleryIndex = (this.activeGalleryIndex + 1) % this.galleryImages.length;
    }
  }

  prevImage(): void {
    if (this.galleryImages.length > 0) {
      this.activeGalleryIndex = (this.activeGalleryIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    }
  }
}
