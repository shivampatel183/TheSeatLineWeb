import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingInitResponseDto } from '../../common/model/api.model';

@Component({
  selector: 'app-review-payment',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './review-payment.component.html',
  styleUrl: './review-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPaymentComponent implements OnInit, OnDestroy {
  booking: BookingInitResponseDto | null = null;
  holdMessage = '';
  isExpired = false;
  countdownText = '';
  isProcessing = false;

  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.booking = nav.extras.state['booking'] as BookingInitResponseDto;
      this.holdMessage = nav.extras.state['holdMessage'] as string || '';
    }
  }

  ngOnInit(): void {
    if (!this.booking) {
      this.router.navigate(['/']);
      return;
    }
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  get formattedShowDate(): string {
    if (!this.booking?.showDate) return '';
    return new Date(this.booking.showDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  get formattedShowTime(): string {
    if (!this.booking?.showDate) return '';
    return new Date(this.booking.showDate).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  get totalQuantity(): number {
    return (this.booking?.lineItems ?? []).reduce(
      (sum, li) => sum + li.quantity,
      0,
    );
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: this.booking?.currency ?? 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  proceedToPay(): void {
    if (this.isExpired || this.isProcessing) return;
    this.isProcessing = true;
    // Payment integration placeholder
    this.cdr.markForCheck();
  }

  private startCountdown(): void {
    this.updateCountdown();
    this.timerId = setInterval(() => this.updateCountdown(), 1000);
  }

  private updateCountdown(): void {
    if (!this.booking?.holdExpiresAt) return;

    const now = Date.now();
    const expires = new Date(this.booking.holdExpiresAt).getTime();
    const diff = expires - now;

    if (diff <= 0) {
      this.isExpired = true;
      this.countdownText = '00:00';
      this.clearTimer();
    } else {
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      this.countdownText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    this.cdr.markForCheck();
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
