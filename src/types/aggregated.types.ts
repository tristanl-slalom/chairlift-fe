import { Booking } from './booking.types';
import { Customer } from './customer.types';
import { Flight } from './flight.types';

export interface BookingDetails extends Booking {
  flight: Flight;
  customer: Customer;
}

export interface CustomerDashboard {
  customer: Customer;
  upcomingBookings: Array<{
    booking: Booking;
    flight: Flight;
  }>;
  pastBookings: Array<{
    booking: Booking;
    flight: Flight;
  }>;
}
