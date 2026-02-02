import { useParams, useNavigate } from 'react-router-dom';
import { useCustomerDashboard } from '../hooks/useCustomers';
import { LoyaltyBadge } from '../components/LoyaltyBadge';
import { BookingCard } from '../components/BookingCard';

export default function CustomerDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dashboard, isLoading, error } = useCustomerDashboard(id || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard: {error?.message || 'Customer not found'}</p>
        </div>
      </div>
    );
  }

  const { customer, upcomingBookings, pastBookings } = dashboard;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-gray-600">{customer.email}</p>
              {customer.phoneNumber && (
                <p className="text-gray-600">{customer.phoneNumber}</p>
              )}
            </div>
            {customer.loyaltyProgram && (
              <LoyaltyBadge loyaltyProgram={customer.loyaltyProgram} />
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Trips</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Book New Flight
            </button>
          </div>

          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBookings.map(({ booking, flight }) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  flight={flight}
                  onClick={() => navigate(`/bookings/${booking.bookingId}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No upcoming trips</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Search Flights
              </button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Trips</h2>
          {pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastBookings.map(({ booking, flight }) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  flight={flight}
                  onClick={() => navigate(`/bookings/${booking.bookingId}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No past trips</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
