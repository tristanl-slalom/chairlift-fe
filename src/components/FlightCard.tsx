import { Flight } from '../types/flight.types';

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const departureDate = new Date(flight.departureTime);
  const arrivalDate = new Date(flight.arrivalTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{flight.airline}</h3>
          <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
          <p className="text-xs text-gray-500">{flight.availableSeats} seats left</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{formatTime(departureDate)}</p>
          <p className="text-sm text-gray-600">{flight.origin}</p>
          <p className="text-xs text-gray-500">{formatDate(departureDate)}</p>
        </div>

        <div className="flex-1 px-4">
          <div className="border-t-2 border-gray-300 relative">
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{formatTime(arrivalDate)}</p>
          <p className="text-sm text-gray-600">{flight.destination}</p>
          <p className="text-xs text-gray-500">{formatDate(arrivalDate)}</p>
        </div>
      </div>

      {onSelect && (
        <button
          onClick={() => onSelect(flight)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Select Flight
        </button>
      )}
    </div>
  );
}
