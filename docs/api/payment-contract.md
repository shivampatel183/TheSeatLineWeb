# Payment Contract

Base client routes:

- `POST /payment/create-order/{bookingId}`
- `POST /payment/verify`

## Create Order Request

`CreatePaymentOrderRequestDto`

- `gatewayProvider?: string | null`
- `method?: number | null`
- `returnUrl?: string | null`

The review-payment page currently sends `gatewayProvider: "phonepe"` and the current browser URL as `returnUrl`.

## Create Order Response

`PaymentOrderResponseDto` extends the shared payment payload with:

- `checkoutUrl?: string | null`
- `gatewayMetadata?: string | null`

The client redirects immediately when `checkoutUrl` is present.

## Verify Request

`PaymentVerifyDto`

- `paymentId?: string | null`
- `bookingId: string`
- `merchantOrderId: string`
- `gatewayOrderId?: string | null`
- `gatewayPaymentId?: string | null`
- `gatewaySignature?: string | null`
- `gatewayStatus?: string | null`
- `gatewayPayload?: string | null`

## Shared Payment Response

`PaymentResponseDto`

- Identifiers: `paymentId`, `bookingId`, `merchantOrderId`
- Provider fields: `gatewayProvider`, `gatewayOrderId`, `gatewayPaymentId`, `gatewayRefundId`
- Status fields: `gatewayStatus`, `status`, `method`
- Money fields: `amount`, `refundAmount`, `currency`
- Diagnostics: `failureReason`, `refundReason`, `refundedAt`, `webhookReceivedAt`
- Timestamps: `createdAt`, `updatedAt`

## Developer Notes

- `PaymentService` now returns typed observables for both create-order and verify calls, so downstream UI code should stop using `any` for payment flows.
- Keep new payment screens aligned with these shared interfaces to avoid duplicate payload definitions across the Angular app.
