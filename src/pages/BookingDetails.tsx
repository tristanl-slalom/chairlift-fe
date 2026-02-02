import { useParams, useNavigate } from 'react-router-dom';
import { useBookingDetails } from '../hooks/useBookings';
import { LoyaltyBadge } from '../components/LoyaltyBadge';

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bookingDetails, isLoading, error } = useBookingDetails(id || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading booking: {error?.message || 'Booking not found'}</p>
        </div>
      </div>
    );
  }

  const { flight, customer, ...booking } = bookingDetails;
  const departureDate = new Date(flight.departureTime);
  const arrivalDate = new Date(flight.arrivalTime);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const getStatusColor = (status: typeof booking.status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
              <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Flight Information</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{flight.airlineCode} {flight.flightNumber}</h3>
                  <p className="text-gray-600">{flight.aircraft}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">${booking.totalPrice}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">DEPARTURE</h4>
                  <p className="text-2xl font-bold text-gray-900">{flight.origin}</p>
                  <p className="text-gray-700">{formatDate(departureDate)}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-2">{formatTime(departureDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">ARRIVAL</h4>
                  <p className="text-2xl font-bold text-gray-900">{flight.destination}</p>
                  <p className="text-gray-700">{formatDate(arrivalDate)}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-2">{formatTime(arrivalDate)}</p>
                </div>
              </div>

              {booking.seatNumber && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">SEAT ASSIGNMENT</h4>
                  <p className="text-2xl font-bold text-gray-900">{booking.seatNumber}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Passenger Information</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-gray-700 mb-1">{customer.email}</p>
                  {customer.phoneNumber && (
                    <p className="text-gray-700">{customer.phoneNumber}</p>
                  )}
                </div>
                {customer.loyaltyProgram && (
                  <LoyaltyBadge loyaltyProgram={customer.loyaltyProgram} />
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <p>Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
                {booking.updatedAt !== booking.createdAt && (
                  <p>Last updated {new Date(booking.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
