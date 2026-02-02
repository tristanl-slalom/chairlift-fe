export interface Booking {
  bookingId: string;
  customerId: string;
  flightId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  seatNumber?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  customerId: string;
  flightId: string;
  seatNumber?: string;
}
