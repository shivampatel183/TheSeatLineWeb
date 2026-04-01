import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.services';
import {
  CreatePaymentOrderRequestDto,
  PaymentOrderResponseDto,
  PaymentResponseDto,
  PaymentVerifyDto,
} from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private apiService: ApiService) {}

  createOrder(
    bookingId: string,
    request: CreatePaymentOrderRequestDto = {},
  ): Observable<PaymentOrderResponseDto> {
    return this.apiService
      .post<PaymentOrderResponseDto>(`/payment/create-order/${bookingId}`, request)
      .pipe(map((response) => response.data));
  }

  verifyPayment(payload: PaymentVerifyDto): Observable<PaymentResponseDto> {
    return this.apiService
      .post<PaymentResponseDto>('/payment/verify', payload)
      .pipe(map((response) => response.data));
  }
}
