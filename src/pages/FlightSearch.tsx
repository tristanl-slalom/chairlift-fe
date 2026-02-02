import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlightSearch } from '../hooks/useFlights';
import { FlightCard } from '../components/FlightCard';
import { SearchFlightsParams, Flight } from '../types/flight.types';

export default function FlightSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchFlightsParams>({});
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    minPrice: '',
    maxPrice: ''
  });

  const { data: flights, isLoading, error } = useFlightSearch(searchParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: SearchFlightsParams = {};

    if (formData.origin) params.origin = formData.origin;
    if (formData.destination) params.destination = formData.destination;
    if (formData.departureDate) params.departureDate = formData.departureDate;
    if (formData.minPrice) params.minPrice = parseFloat(formData.minPrice);
    if (formData.maxPrice) params.maxPrice = parseFloat(formData.maxPrice);

    setSearchParams(params);
  };

  const handleFlightSelect = (flight: Flight) => {
    navigate(`/booking?flightId=${flight.flightId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Flights</h1>

      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
            <input
              type="text"
              placeholder="e.g., SEA"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <input
              type="text"
              placeholder="e.g., LAX"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              placeholder="$100"
              value={formData.minPrice}
              onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              placeholder="$1000"
              value={formData.maxPrice}
              onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Search Flights
        </button>
      </form>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching flights...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error loading flights: {error.message}</p>
        </div>
      )}

      {flights && flights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Found {flights.length} flight{flights.length !== 1 ? 's' : ''}
          </h2>
          {flights.map((flight) => (
            <FlightCard key={flight.flightId} flight={flight} onSelect={handleFlightSelect} />
          ))}
        </div>
      )}

      {flights && flights.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No flights found. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
