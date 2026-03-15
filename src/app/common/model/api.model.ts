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
  slug: string;
  description: string;
  eventType: number;
  language: string | null;
  startDateTime: string;
  endDateTime?: string;
  bannerImageUrl: string;
  venueId: string;
  venueName: string;
  city: string;
  citySlug?: string;
  state?: string;
  status?: number;
  timezone?: string;
  performers?: string | string[] | null;
  ageRestriction?: number;
  maxCapacity?: number;
  isRecurring?: boolean;
  recurrenceRule?: string | null;
  images?: string[];
  categoryName?: string | null;
  tags?: string[];
  shows?: EventShowDTO[];
}

export interface EventShowDTO {
  id: string;
  startDateTime: string;
  endDateTime: string;
  status: number;
  availableSeats: number;
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
export interface ShowSelectDTO {
  id: string;
  eventId: string;
  venueName: string;
  city: string;
  showDate: string;
  showTime: string;
  price: number;
}

export interface EventShowListDTO {
  id: string;
  eventId: string;
  eventTitle: string;
  startDateTime: string;
  endDateTime: string;
  status: number;
  maxCapacity: number;
}
