import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { EventService } from '../../common/Services/event.service';
import { EventSelectDTO } from '../../common/model/api.model';
import { PreloaderComponent } from '../../common/components/preloader/preloader.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PreloaderComponent],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent implements OnInit {
  event: EventSelectDTO | null = null;
  isLoading = true;
  hasError = false;
  currentSlug: string | null = null;
  activeGalleryIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.currentSlug = this.route.snapshot.paramMap.get('slug');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe({
        next: (data) => {
          this.event = data;
          this.activeGalleryIndex = 0;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading event data', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  get formattedDate(): string {
    if (!this.event?.startDateTime) return '';
    return new Date(this.event.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get parsedPerformers(): string[] {
    const performers = this.event?.performers;
    if (!performers) return [];
    if (Array.isArray(performers)) return performers;
    try {
      const parsed = JSON.parse(performers);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  get galleryImages(): string[] {
    const imageSet = new Set<string>();
    const addImage = (value?: string | null): void => {
      const trimmedValue = value?.trim();
      if (trimmedValue) {
        imageSet.add(trimmedValue);
      }
    };

    addImage(this.event?.bannerImageUrl);

    const additionalImages = this.event?.images;
    if (Array.isArray(additionalImages)) {
      for (const item of additionalImages) {
        if (typeof item === 'string') {
          for (const url of item.split(',')) {
            addImage(url);
          }
          continue;
        }

        if (item && typeof item.imageUrl === 'string') {
          addImage(item.imageUrl);
        }
      }
    } else if (typeof additionalImages === 'string') {
      for (const url of additionalImages.split(',')) {
        addImage(url);
      }
    }

    return Array.from(imageSet);
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

  getStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return 'Active';
      case 2:
        return 'Sold Out';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1:
        return 'active';
      case 2:
        return 'sold-out';
      case 3:
        return 'cancelled';
      default:
        return 'unknown';
    }
  }

  goToShows(): void {
    const eventId = this.event?.id;
    const slug = this.event?.slug || this.currentSlug;

    if (eventId && slug) {
      this.router.navigate(['/event', slug, eventId, 'shows']);
    }
  }
}
