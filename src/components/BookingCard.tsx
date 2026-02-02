import { Booking } from '../types/booking.types';
import { Flight } from '../types/flight.types';

interface BookingCardProps {
  booking: Booking;
  flight: Flight;
  onClick?: () => void;
}

export function BookingCard({ booking, flight, onClick }: BookingCardProps) {
  const departureDate = new Date(flight.departureTime);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{flight.airlineCode} {flight.flightNumber}</h3>
          <p className="text-sm text-gray-600">{flight.aircraft}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Departure</p>
          <p className="text-sm font-semibold text-gray-900">{flight.origin}</p>
          <p className="text-sm text-gray-600">{formatDate(departureDate)}</p>
          <p className="text-sm text-gray-600">{formatTime(departureDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Arrival</p>
          <p className="text-sm font-semibold text-gray-900">{flight.destination}</p>
        </div>
      </div>

      {booking.seatNumber && (
        <div className="mb-2">
          <p className="text-xs text-gray-500">Seat Number</p>
          <p className="text-sm font-semibold text-gray-900">{booking.seatNumber}</p>
        </div>
      )}

      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Total Price</p>
          <p className="text-xl font-bold text-blue-600">${booking.totalPrice}</p>
        </div>
      </div>
    </div>
  );
}
