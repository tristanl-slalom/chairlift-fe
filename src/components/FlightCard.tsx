import { Flight } from '../types/flight.types';

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalAvailableSeats = flight.availableSeats.economy +
                              flight.availableSeats.business +
                              flight.availableSeats.first;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{flight.airlineCode} {flight.flightNumber}</h3>
          <p className="text-sm text-gray-500">{flight.aircraft}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">${flight.pricing.economy}</p>
          <p className="text-xs text-gray-500">from economy</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{flight.departureTime}</p>
          <p className="text-sm text-gray-600">{flight.origin}</p>
          <p className="text-xs text-gray-500">{formatDate(flight.departureDate)}</p>
        </div>

        <div className="flex-1 px-4">
          <div className="border-t-2 border-gray-300 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <p className="text-xs text-gray-500">{formatDuration(flight.duration)}</p>
            </div>
            <svg
              className="absolute top-1/2 right-0 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</p>
          <p className="text-sm text-gray-600">{flight.destination}</p>
          <p className="text-xs text-gray-500">{formatDate(flight.arrivalDate)}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>{totalAvailableSeats} seats available</span>
        <span>Economy ${flight.pricing.economy} • Business ${flight.pricing.business} • First ${flight.pricing.first}</span>
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
