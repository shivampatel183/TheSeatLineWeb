import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../common/Services/event.service';
import { SeatService } from '../../common/Services/seat.service';
import { BookingService } from '../../common/Services/booking.service';
import { EventSelectDTO, SeatSelectDTO } from '../../common/model/api.model';
import { SeatLayoutComponent } from '../../Component/seat-layout/seat-layout.component';
import { forkJoin } from 'rxjs';
import { PaymentService } from '../../common/Services/payment.service';
import { interval, takeWhile, switchMap } from 'rxjs';

declare var Razorpay: any;

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, SeatLayoutComponent],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit {
  event!: EventSelectDTO;
  seats: SeatSelectDTO[] = [];
  selectedSeats: SeatSelectDTO[] = [];
  isLoading = true;
  isProcessing = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private seatService: SeatService,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      forkJoin({
        event: this.eventService.getEventById(eventId),
        seats: this.seatService.getSeatsByEventId(eventId)
      }).subscribe({
        next: (data) => {
          this.event = data.event;
          this.seats = data.seats;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading event data', err);
          this.isLoading = false;
        }
      });
    }
  }

  onSelectionChange(selected: SeatSelectDTO[]): void {
    this.selectedSeats = selected;
  }

  get totalAmount(): number {
    return this.selectedSeats.reduce((sum, seat) => sum + seat.basePrice, 0);
  }

  proceedToBook(): void {
    if (this.selectedSeats.length === 0 || this.isProcessing) return;
    
    this.isProcessing = true;
    const request = {
      eventId: this.event.id,
      seatIds: this.selectedSeats.map(s => s.id)
    };

    this.bookingService.createBooking(request).subscribe({
      next: (booking) => {
        this.initiatePayment(booking.id, booking.totalAmount);
      },
      error: (err) => {
        console.error('Error creating booking', err);
        this.isProcessing = false;
      }
    });
  }

  private initiatePayment(bookingId: string, amount: number): void {
    this.paymentService.createOrder(bookingId).subscribe({
      next: (order) => {
        const options = {
          key: 'rzp_test_your_key', // This should normally come from config
          amount: order.amount,
          currency: order.currency,
          name: 'TheSeatLine',
          description: 'Seat Booking Payment',
          order_id: order.id,
          handler: (response: any) => {
            this.verifyPayment(response, bookingId);
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com'
          },
          theme: {
            color: '#6366f1'
          },
          modal: {
            ondismiss: () => {
              this.isProcessing = false;
            }
          }
        };
        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        console.error('Error creating payment order', err);
        this.isProcessing = false;
      }
    });
  }

  private verifyPayment(razorpayResponse: any, bookingId: string): void {
    const payload = {
      ...razorpayResponse,
      bookingId
    };

    this.paymentService.verifyPayment(payload).subscribe({
      next: () => {
        this.pollBookingStatus(bookingId);
      },
      error: (err) => {
        console.error('Payment verification failed', err);
        this.isProcessing = false;
      }
    });
  }

  private pollBookingStatus(bookingId: string): void {
    interval(2000)
      .pipe(
        switchMap(() => this.bookingService.getBookingById(bookingId)),
        takeWhile((booking) => booking.status === 'Pending', true)
      )
      .subscribe((booking) => {
        if (booking.status === 'Confirmed') {
          console.log('Booking Confirmed!');
          // Navigate to success page or show success message
          this.isProcessing = false;
        }
      });
  }
}
