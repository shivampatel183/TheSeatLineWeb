export interface ApiResponse<T> {
  data: T;
  message: string | null;
  error?: string | null;
  Success: boolean;
  success?: boolean;
  isSuccess?: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
  user: User;
}

export interface EventSelectDTO {
  id: string;
  title: string;
  description: string;
  eventType: number;
  language: string;
  startDateTime: string;
  bannerImageUrl: string;
  venueName: string;
  city: string;
}

export interface SeatSelectDTO {
  id: string;
  seatNumber: string;
  section: string;
  row: string;
  seatType: number;
  status: number;
  basePrice: number;
  currency: string;
  isAisle: boolean;
  isWindow: boolean;
}

export interface BookingSeatDto {
  seatId: string;
  priceAtBooking: number;
}

export interface BookingResponseDto {
  id: string;
  bookingReference: string;
  eventId: string;
  status: string;
  totalAmount: number;
  holdExpiresAt: string;
  seats: BookingSeatDto[];
}

export interface CreateBookingRequest {
  eventId: string;
  seatIds: string[];
}
