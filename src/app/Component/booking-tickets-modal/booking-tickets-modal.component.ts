import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as QRCode from 'qrcode';
import { BookingService } from '../../common/Services/booking.service';
import { ToastService } from '../../common/Services/toast.service';
import {
  BookingTicketDto,
  BookingTicketsResponseDto,
} from '../../common/model/api.model';

@Component({
  selector: 'app-booking-tickets-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-tickets-modal.component.html',
  styleUrls: ['./booking-tickets-modal.component.scss'],
})
export class BookingTicketsModalComponent implements OnChanges {
  @Input({ required: true }) bookingId!: string;
  @Output() closed = new EventEmitter<void>();

  isLoading = false;
  data: BookingTicketsResponseDto | null = null;
  activeIndex = 0;

  qrDataUrlByTicketId = new Map<string, string>();

  constructor(
    private bookingService: BookingService,
    private toast: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingId'] && this.bookingId) {
      this.loadTickets();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.closed.emit();
  }

  get tickets(): BookingTicketDto[] {
    return this.data?.tickets ?? [];
  }

  get activeTicket(): BookingTicketDto | null {
    return this.tickets.length > 0 ? this.tickets[this.activeIndex] : null;
  }

  prev(): void {
    if (this.tickets.length <= 1) return;
    this.activeIndex =
      (this.activeIndex - 1 + this.tickets.length) % this.tickets.length;
  }

  next(): void {
    if (this.tickets.length <= 1) return;
    this.activeIndex = (this.activeIndex + 1) % this.tickets.length;
  }

  goTo(index: number): void {
    if (index < 0 || index >= this.tickets.length) return;
    this.activeIndex = index;
  }

  trackTicketId(_: number, item: BookingTicketDto): string {
    return item.ticketId;
  }

  getQrDataUrl(ticketId: string): string | null {
    return this.qrDataUrlByTicketId.get(ticketId) ?? null;
  }

  private loadTickets(): void {
    this.isLoading = true;
    this.data = null;
    this.activeIndex = 0;
    this.qrDataUrlByTicketId.clear();

    this.bookingService.getBookingTickets(this.bookingId).subscribe({
      next: async (data) => {
        this.data = data;
        this.isLoading = false;

        const tickets = data?.tickets ?? [];
        await Promise.all(
          tickets.map(async (t) => {
            if (!t.canShowQr || !t.qrCode) return;
            try {
              const url = await QRCode.toDataURL(t.qrCode, {
                margin: 1,
                // Generate at higher resolution then scale down via CSS to keep it crisp on mobile.
                width: 512,
                color: {
                  dark: '#0f172a',
                  light: '#ffffff',
                },
              });
              this.qrDataUrlByTicketId.set(t.ticketId, url);
            } catch {
              // Ignore QR render failure for a single ticket; UI will fallback.
            }
          }),
        );
      },
      error: (error) => {
        console.error('Error loading booking tickets:', error);
        this.toast.error('Failed to load tickets. Please try again.');
        this.isLoading = false;
      },
    });
  }
}
