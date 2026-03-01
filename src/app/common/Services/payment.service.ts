import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private apiService: ApiService) {}

  createOrder(bookingId: string): Observable<any> {
    return this.apiService.post<any>(`/payment/create-order/${bookingId}`, {}).pipe(
      map(response => response.data)
    );
  }

  verifyPayment(payload: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; bookingId: string }): Observable<any> {
    return this.apiService.post<any>('/payment/verify', payload).pipe(
      map(response => response.data)
    );
  }
}
