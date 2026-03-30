# Booking History API Data Format

This document describes the response the current frontend expects from the live booking-history endpoint.

## Endpoint

`GET /api/Booking/my`

## Auth

Authenticated request.

In the current Angular app, requests are sent with `withCredentials: true`, and the interceptor also adds the in-memory bearer token when available.

## Response Envelope

The endpoint returns the shared API wrapper:

```json
{
  "success": true,
  "data": [],
  "message": null,
  "error": null
}
```

## Data Shape

`data` is an array of `BookingResponseDto`.

```json
[
  {
    "id": "guid",
    "bookingReference": "TSL20260330ABC123",
    "userId": "guid",
    "eventId": "guid",
    "status": "Confirmed",
    "subTotal": 998,
    "discountAmount": 0,
    "taxAmount": 3.59,
    "convenienceFee": 19.96,
    "totalAmount": 1021.55,
    "currency": "INR",
    "holdExpiresAt": null,
    "cancelledAt": null,
    "cancellationReason": null,
    "createdAt": "2026-03-30T10:00:00",
    "seats": [
      {
        "seatId": "guid",
        "seatNumber": "A10",
        "seatType": "SeatWise",
        "row": "A",
        "price": 499
      }
    ]
  }
]
```

## Field Notes

| Field | Type | Notes |
|---|---|---|
| `id` | string | booking id |
| `bookingReference` | string | user-visible reference |
| `userId` | string | current booking owner |
| `eventId` | string | event id |
| `status` | string | enum name from `BookingStatus` |
| `subTotal` | number | pre-fee amount |
| `discountAmount` | number | currently often `0` |
| `taxAmount` | number | calculated by backend |
| `convenienceFee` | number | calculated by backend |
| `totalAmount` | number | final amount |
| `currency` | string | currently `INR` |
| `holdExpiresAt` | string or null | populated for pending holds |
| `cancelledAt` | string or null | populated for cancelled bookings |
| `cancellationReason` | string or null | populated when cancelled |
| `createdAt` | string | booking creation timestamp |
| `seats` | array | seat details when the booking contains seat assignments |

## Important Current Behavior

- Category-based bookings can return an empty `seats` array because the response DTO currently maps only seat-level ticket details.
- The frontend My Bookings page mainly uses `status`, `totalAmount`, `createdAt`, and `seats`.
