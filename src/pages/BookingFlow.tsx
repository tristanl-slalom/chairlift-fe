import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFlightDetails } from '../hooks/useFlights';
import { useCreateBooking } from '../hooks/useBookings';
import { FlightCard } from '../components/FlightCard';

export default function BookingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get('flightId') || '';

  const { data: flight, isLoading: flightLoading } = useFlightDetails(flightId);
  const createBooking = useCreateBooking();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerId: '',
    seatNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        customerId: formData.customerId,
        flightId,
        seatNumber: formData.seatNumber || undefined
      });

      navigate(`/bookings/${booking.bookingId}`);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (flightLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Flight not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Flight</h1>

        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Customer Info</span>
            </div>
            <div className="w-24 h-1 mx-4 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Flight</h2>
          <FlightCard flight={flight} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Passenger Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your customer ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seat Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.seatNumber}
                  onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 12A"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Booking</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer ID:</span>
                  <span className="font-semibold">{formData.customerId}</span>
                </div>
                {formData.seatNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seat Number:</span>
                    <span className="font-semibold">{formData.seatNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg border-t pt-2 mt-2">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-bold text-blue-600">${flight.pricing.economy}</span>
                </div>
              </div>
            </div>
          )}

          {createBooking.error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error: {createBooking.error.message}</p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={createBooking.isPending}
              className={`${step === 1 ? 'ml-auto' : ''} bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {step === 1 ? 'Continue' : createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
