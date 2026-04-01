import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PaymentService } from '../../common/Services/payment.service';
import { ToastService } from '../../common/Services/toast.service';
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
    private paymentService: PaymentService,
    private toast: ToastService,
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
    if (this.isExpired || this.isProcessing || !this.booking) return;

    this.isProcessing = true;
    this.cdr.markForCheck();

    const returnUrl =
      typeof window !== 'undefined' ? window.location.href : undefined;

    this.paymentService
      .createOrder(this.booking.bookingId, {
        gatewayProvider: 'phonepe',
        returnUrl,
      })
      .pipe(
        finalize(() => {
          this.isProcessing = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (order) => {
          if (order.checkoutUrl && typeof window !== 'undefined') {
            window.location.assign(order.checkoutUrl);
            return;
          }

          this.toast.warning(
            'Payment order created, but checkout redirect is not available yet.',
          );
        },
        error: (error: unknown) => {
          this.toast.error(this.getPaymentErrorMessage(error));
        },
      });
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

  private getPaymentErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage =
        (error.error as { message?: string; error?: string } | null)?.message ??
        (error.error as { message?: string; error?: string } | null)?.error;

      return backendMessage || 'Unable to start payment. Please try again.';
    }

    return 'Unable to start payment. Please try again.';
  }
}
