import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type PaymentResultState = 'success' | 'failed' | 'pending';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss',
})
export class PaymentResultComponent {
  readonly status: PaymentResultState;
  readonly message: string;
  readonly bookingId: string | null;
  readonly merchantOrderId: string | null;
  readonly provider: string;

  constructor(private route: ActivatedRoute) {
    const statusParam = this.route.snapshot.queryParamMap.get('status');
    this.status = this.toStatus(statusParam);
    this.message =
      this.route.snapshot.queryParamMap.get('message') ??
      this.defaultMessage(this.status);
    this.bookingId = this.route.snapshot.queryParamMap.get('bookingId');
    this.merchantOrderId =
      this.route.snapshot.queryParamMap.get('merchantOrderId');
    this.provider =
      this.route.snapshot.queryParamMap.get('provider')?.toUpperCase() ??
      'PAYMENT';
  }

  get title(): string {
    return this.status === 'success'
      ? 'Payment successful'
      : this.status === 'failed'
        ? 'Payment failed'
        : 'Payment pending';
  }

  get description(): string {
    return this.status === 'success'
      ? 'Your booking has been confirmed. You can review it from My Bookings.'
      : this.status === 'failed'
        ? 'Your booking is still on hold until the timer expires. You can retry from the review page.'
        : 'We are waiting for final confirmation from the gateway. You can check My Bookings in a moment.';
  }

  get statusClass(): string {
    return `payment-result-card--${this.status}`;
  }

  private toStatus(value: string | null): PaymentResultState {
    return value === 'success' || value === 'failed' ? value : 'pending';
  }

  private defaultMessage(status: PaymentResultState): string {
    return status === 'success'
      ? 'Payment completed and your booking is confirmed.'
      : status === 'failed'
        ? 'Payment could not be completed.'
        : 'Payment confirmation is still in progress.';
  }
}
