import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BookingService } from '../../common/Services/booking.service';
import { PaymentService } from '../../common/Services/payment.service';
import { ToastService } from '../../common/Services/toast.service';
import {
  BookingInitResponseDto,
  PaymentOrderResponseDto,
  PaymentResponseDto,
  RazorpayCheckoutMetadata,
} from '../../common/model/api.model';

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
    reason?: string;
    metadata?: {
      payment_id?: string;
      order_id?: string;
    };
  };
}

interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', callback: (response: RazorpayFailureResponse) => void): void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  retry?: {
    enabled?: boolean;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

@Component({
  selector: 'app-review-payment',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './review-payment.component.html',
  styleUrl: './review-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPaymentComponent implements OnInit, OnDestroy {
  private static razorpayLoader: Promise<void> | null = null;

  booking: BookingInitResponseDto | null = null;
  holdMessage = '';
  isExpired = false;
  countdownText = '';
  isProcessing = false;
  isLoadingInit = false;

  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private bookingService: BookingService,
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
    if (this.booking) {
      this.startCountdown();
      return;
    }

    const bookingId = this.route.snapshot.queryParamMap.get('bookingId');
    if (!bookingId) {
      this.router.navigate(['/']);
      return;
    }

    this.isLoadingInit = true;
    this.cdr.markForCheck();

    this.bookingService
      .getBookingInit(bookingId)
      .pipe(
        finalize(() => {
          this.isLoadingInit = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (booking) => {
          this.booking = booking;
          this.startCountdown();
        },
        error: () => {
          this.toast.error('Unable to load booking for payment. Please try again.');
          this.router.navigate(['/my-bookings']);
        },
      });
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
      typeof window !== 'undefined'
        ? `${window.location.origin}/payment/result`
        : undefined;

    this.paymentService
      .createOrder(this.booking.bookingId, {
        gatewayProvider: 'razorpay',
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
          if (order.gatewayProvider === 'razorpay') {
            void this.launchRazorpayCheckout(order);
            return;
          }

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

  private async launchRazorpayCheckout(
    order: PaymentOrderResponseDto,
  ): Promise<void> {
    try {
      await this.ensureRazorpayLoaded();

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout failed to load.');
      }

      const checkoutMetadata = this.parseRazorpayMetadata(order.gatewayMetadata);
      if (!order.gatewayOrderId || !this.booking) {
        throw new Error('Razorpay order details are missing.');
      }

      const options: RazorpayOptions = {
        key: checkoutMetadata.keyId,
        amount: checkoutMetadata.amount,
        currency: checkoutMetadata.currency,
        name: checkoutMetadata.name,
        description: checkoutMetadata.description,
        image: checkoutMetadata.imageUrl ?? undefined,
        order_id: order.gatewayOrderId,
        handler: (response) => {
          void this.verifyRazorpayPayment(order, response);
        },
        modal: {
          ondismiss: () => {
            this.toast.warning(
              'Payment window closed. Your booking is still on hold.',
            );
          },
        },
        notes: {
          bookingId: this.booking.bookingId,
          bookingReference: this.booking.bookingReference,
        },
        theme: {
          color: checkoutMetadata.themeColor,
        },
        retry: {
          enabled: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        const message =
          response.error?.description ||
          response.error?.reason ||
          'Payment could not be completed.';

        this.goToResult('failed', order, message);
      });
      razorpay.open();
    } catch (error) {
      this.toast.error(this.getRazorpayLoadErrorMessage(error));
    }
  }

  private verifyRazorpayPayment(
    order: PaymentOrderResponseDto,
    response: RazorpaySuccessResponse,
  ): void {
    if (!this.booking) {
      return;
    }

    this.isProcessing = true;
    this.cdr.markForCheck();

    this.paymentService
      .verifyPayment({
        bookingId: this.booking.bookingId,
        merchantOrderId: order.merchantOrderId,
        gatewayOrderId: order.gatewayOrderId ?? response.razorpay_order_id,
        gatewayPaymentId: response.razorpay_payment_id,
        gatewaySignature: response.razorpay_signature,
      })
      .pipe(
        finalize(() => {
          this.isProcessing = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (payment) => {
          this.goToResult(
            payment.status === 'Success' ? 'success' : 'pending',
            order,
            this.buildPaymentMessage(payment),
          );
        },
        error: (error: unknown) => {
          this.goToResult('failed', order, this.getPaymentErrorMessage(error));
        },
      });
  }

  private async ensureRazorpayLoaded(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Razorpay checkout is only available in the browser.');
    }

    if (window.Razorpay) {
      return;
    }

    if (!ReviewPaymentComponent.razorpayLoader) {
      ReviewPaymentComponent.razorpayLoader = new Promise<void>(
        (resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error('Unable to load Razorpay checkout.'));
          document.body.appendChild(script);
        },
      );
    }

    return ReviewPaymentComponent.razorpayLoader;
  }

  private parseRazorpayMetadata(
    gatewayMetadata: string | null | undefined,
  ): RazorpayCheckoutMetadata {
    if (!gatewayMetadata) {
      throw new Error('Razorpay checkout metadata is missing.');
    }

    const metadata = JSON.parse(gatewayMetadata) as RazorpayCheckoutMetadata;
    if (!metadata.keyId) {
      throw new Error('Razorpay checkout key is missing.');
    }

    return metadata;
  }

  private buildPaymentMessage(payment: PaymentResponseDto): string {
    if (payment.status === 'Success') {
      return 'Payment completed and your booking is confirmed.';
    }

    if (payment.status === 'Pending') {
      return 'Payment is authorized but not captured yet. We will update it shortly.';
    }

    return payment.failureReason || 'Payment could not be completed.';
  }

  private goToResult(
    status: 'success' | 'failed' | 'pending',
    order: PaymentOrderResponseDto,
    message: string,
  ): void {
    this.router.navigate(['/payment/result'], {
      queryParams: {
        status,
        bookingId: order.bookingId,
        merchantOrderId: order.merchantOrderId,
        provider: order.gatewayProvider,
        message,
      },
    });
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

  private getRazorpayLoadErrorMessage(error: unknown): string {
    return error instanceof Error
      ? error.message
      : 'Unable to launch Razorpay checkout.';
  }
}
