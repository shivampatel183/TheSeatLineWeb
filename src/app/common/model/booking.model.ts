export interface Booking {
  id: number;
  userId: number;
  venueId: number;
  showId: number;
  bookingDate: Date;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  seats: BookingSeat[];
  venue?: Venue;
  show?: Show;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingSeat {
  id: number;
  bookingId: number;
  seatId: number;
  seatNumber: string;
  seatType: string;
  price: number;
  row: string;
  column: number;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  imageUrl?: string;
  description?: string;
  capacity: number;
}

export interface Show {
  id: number;
  venueId: number;
  title: string;
  description: string;
  showDate: Date;
  showTime: string;
  duration: number;
  genre: string;
  imageUrl?: string;
  price: number;
  availableSeats: number;
}

export interface Seat {
  id: number;
  venueId: number;
  seatNumber: string;
  row: string;
  column: number;
  seatType: SeatType;
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

export enum SeatType {
  Regular = 'Regular',
  Premium = 'Premium',
  VIP = 'VIP',
  Wheelchair = 'Wheelchair',
}

export interface CreateBookingRequest {
  venueId: number;
  showId: number;
  seatIds: number[];
  totalAmount: number;
}

export interface BookingResponse {
  booking: Booking;
  message: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  totalCount: number;
}
