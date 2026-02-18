# API Data Format for /Booking/my-bookings

## Endpoint
`GET /api/Booking/my-bookings`

## Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

## Response Format

### Success Response Structure
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 123,
      "venueId": 5,
      "showId": 10,
      "bookingDate": "2026-02-15T10:30:00Z",
      "totalAmount": 150.00,
      "status": "Confirmed",
      "paymentStatus": "Paid",
      "createdAt": "2026-02-15T10:30:00Z",
      "updatedAt": "2026-02-15T10:30:00Z",
      "seats": [
        {
          "id": 1,
          "bookingId": 1,
          "seatId": 45,
          "seatNumber": "A12",
          "seatType": "Premium",
          "price": 75.00,
          "row": "A",
          "column": 12
        },
        {
          "id": 2,
          "bookingId": 1,
          "seatId": 46,
          "seatNumber": "A13",
          "seatType": "Premium",
          "price": 75.00,
          "row": "A",
          "column": 13
        }
      ],
      "venue": {
        "id": 5,
        "name": "Grand Theater",
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "imageUrl": "https://example.com/venue.jpg",
        "description": "A beautiful historic theater",
        "capacity": 500
      },
      "show": {
        "id": 10,
        "venueId": 5,
        "title": "Hamilton",
        "description": "An American Musical",
        "showDate": "2026-03-20T19:00:00Z",
        "showTime": "7:00 PM",
        "duration": 165,
        "genre": "Musical",
        "imageUrl": "https://example.com/show.jpg",
        "price": 75.00,
        "availableSeats": 250
      }
    }
  ],
  "message": "Bookings retrieved successfully",
  "error": null
}
```

### Error Response Structure
```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": "Failed to retrieve bookings"
}
```

## Field Descriptions

### Booking Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Unique booking identifier |
| userId | number | Yes | ID of the user who made the booking |
| venueId | number | Yes | ID of the venue |
| showId | number | Yes | ID of the show/event |
| bookingDate | Date/string | Yes | When the booking was made (ISO 8601 format) |
| totalAmount | number | Yes | Total cost of the booking |
| status | string | Yes | Booking status: "Pending", "Confirmed", "Cancelled", or "Completed" |
| paymentStatus | string | Yes | Payment status: "Pending", "Paid", "Failed", or "Refunded" |
| seats | BookingSeat[] | Yes | Array of booked seats (can be empty array) |
| venue | Venue | No | Venue details (optional, but recommended) |
| show | Show | No | Show details (optional, but recommended) |
| createdAt | Date/string | Yes | Creation timestamp (ISO 8601 format) |
| updatedAt | Date/string | Yes | Last update timestamp (ISO 8601 format) |

### BookingSeat Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Unique seat booking identifier |
| bookingId | number | Yes | Reference to parent booking |
| seatId | number | Yes | ID of the seat |
| seatNumber | string | Yes | Display name (e.g., "A12") |
| seatType | string | Yes | Type: "Regular", "Premium", "VIP", or "Wheelchair" |
| price | number | Yes | Price for this seat |
| row | string | Yes | Row identifier |
| column | number | Yes | Column number |

### Venue Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Unique venue identifier |
| name | string | Yes | Venue name |
| address | string | Yes | Street address |
| city | string | Yes | City name |
| state | string | Yes | State/province |
| zipCode | string | Yes | Postal code |
| imageUrl | string | No | URL to venue image |
| description | string | No | Venue description |
| capacity | number | Yes | Total seating capacity |

### Show Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Unique show identifier |
| venueId | number | Yes | Reference to venue |
| title | string | Yes | Show title |
| description | string | Yes | Show description |
| showDate | Date/string | Yes | Date of the show (ISO 8601 format) |
| showTime | string | Yes | Display time (e.g., "7:00 PM") |
| duration | number | Yes | Duration in minutes |
| genre | string | Yes | Show genre/category |
| imageUrl | string | No | URL to show poster/image |
| price | number | Yes | Base ticket price |
| availableSeats | number | Yes | Number of available seats |

## Enum Values

### BookingStatus
- `"Pending"` - Booking is pending confirmation
- `"Confirmed"` - Booking is confirmed
- `"Cancelled"` - Booking has been cancelled
- `"Completed"` - Show has been completed

### PaymentStatus
- `"Pending"` - Payment is pending
- `"Paid"` - Payment completed successfully
- `"Failed"` - Payment failed
- `"Refunded"` - Payment has been refunded

### SeatType
- `"Regular"` - Standard seating
- `"Premium"` - Premium seating
- `"VIP"` - VIP seating
- `"Wheelchair"` - Wheelchair accessible seating

## Sample C# Backend Response (ASP.NET Core)

```csharp
[HttpGet("my-bookings")]
[Authorize]
public async Task<IActionResult> GetMyBookings()
{
    try
    {
        var userId = GetCurrentUserId(); // Your method to get user ID from token
        
        var bookings = await _context.Bookings
            .Include(b => b.Seats)
            .Include(b => b.Venue)
            .Include(b => b.Show)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();

        return Ok(new ApiResponse<List<Booking>>
        {
            Success = true,
            Data = bookings,
            Message = "Bookings retrieved successfully",
            Error = null
        });
    }
    catch (Exception ex)
    {
        return BadRequest(new ApiResponse<List<Booking>>
        {
            Success = false,
            Data = null,
            Message = null,
            Error = ex.Message
        });
    }
}
```

## Important Notes

1. **Date Format**: Use ISO 8601 format for all dates (e.g., `"2026-03-20T19:00:00Z"`)
2. **Decimal Numbers**: Use decimal format for prices (e.g., `150.00`)
3. **Null Safety**: The frontend handles null/undefined for optional fields (`venue`, `show`)
4. **Empty Arrays**: If no seats, return empty array `[]` instead of null
5. **Status Values**: Must match exact enum values (case-sensitive)
6. **Authorization**: Endpoint requires Bearer token in Authorization header

## Testing with Mock Data

If you don't have a backend yet, you can test with this mock response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "venueId": 1,
      "showId": 1,
      "bookingDate": "2026-02-15T10:30:00Z",
      "totalAmount": 150.00,
      "status": "Confirmed",
      "paymentStatus": "Paid",
      "createdAt": "2026-02-15T10:30:00Z",
      "updatedAt": "2026-02-15T10:30:00Z",
      "seats": [
        {
          "id": 1,
          "bookingId": 1,
          "seatId": 1,
          "seatNumber": "A12",
          "seatType": "Premium",
          "price": 75.00,
          "row": "A",
          "column": 12
        }
      ],
      "venue": {
        "id": 1,
        "name": "Grand Theater",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "capacity": 500
      },
      "show": {
        "id": 1,
        "venueId": 1,
        "title": "Hamilton",
        "description": "An American Musical",
        "showDate": "2026-03-20T19:00:00Z",
        "showTime": "7:00 PM",
        "duration": 165,
        "genre": "Musical",
        "price": 75.00,
        "availableSeats": 250
      }
    }
  ],
  "message": "Bookings retrieved successfully",
  "error": null
}
```
