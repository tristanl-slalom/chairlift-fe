import { useQuery } from '@tanstack/react-query';
import { flightsApi } from '../api/chairlift-api';
import { SearchFlightsParams } from '../types/flight.types';

const FLIGHTS_QUERY_KEY = 'flights';

export function useFlightSearch(params: SearchFlightsParams) {
  return useQuery({
    queryKey: [FLIGHTS_QUERY_KEY, 'search', params],
    queryFn: () => flightsApi.searchFlights(params),
    enabled: Object.keys(params).length > 0
  });
}

export function useFlightDetails(id: string) {
  return useQuery({
    queryKey: [FLIGHTS_QUERY_KEY, id],
    queryFn: () => flightsApi.getFlight(id),
    enabled: !!id
  });
}
