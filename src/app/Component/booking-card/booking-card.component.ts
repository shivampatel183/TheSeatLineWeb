import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking, BookingStatus, PaymentStatus } from '../../common/model/booking.model';
import { BookingService } from '../../common/Services/booking.service';
import { ToastService } from '../../common/Services/toast.service';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent {
  @Input() booking!: Booking;
  @Output() cancelled = new EventEmitter<number>();

  isCancelling = false;
  BookingStatus = BookingStatus;
  PaymentStatus = PaymentStatus;

  constructor(
    private bookingService: BookingService,
    private toast: ToastService,
  ) {}

  cancelBooking(): void {

    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    this.isCancelling = true;
    this.bookingService.cancelBooking(this.booking.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toast.success('Booking cancelled successfully');
          this.cancelled.emit(this.booking.id);
        } else {
          this.toast.error(response.error || 'Failed to cancel booking');
        }
        this.isCancelling = false;
      },
      error: () => {
        this.toast.error('Error cancelling booking');
        this.isCancelling = false;
      },
    });
  }

  getStatusClass(): string {
    switch (this.booking.status) {
      case BookingStatus.Confirmed:
        return 'status-confirmed';
      case BookingStatus.Cancelled:
        return 'status-cancelled';
      case BookingStatus.Completed:
        return 'status-completed';
      case BookingStatus.Pending:
        return 'status-pending';
      default:
        return '';
    }
  }

  getPaymentStatusClass(): string {
    switch (this.booking.paymentStatus) {
      case PaymentStatus.Paid:
        return 'payment-paid';
      case PaymentStatus.Pending:
        return 'payment-pending';
      case PaymentStatus.Failed:
        return 'payment-failed';
      case PaymentStatus.Refunded:
        return 'payment-refunded';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatTime(time: string): string {
    return time;
  }

  canCancel(): boolean {
    if (!this.booking) return false;
    return (
      this.booking.status === BookingStatus.Confirmed &&
      new Date(this.booking.show?.showDate || this.booking.bookingDate) >
        new Date()
    );
  }

  getSeatNumbers(): string {
    if (!this.booking?.seats || this.booking.seats.length === 0) {
      return 'N/A';
    }
    return this.booking.seats.map((s) => s.seatNumber).join(', ');
  }
}
