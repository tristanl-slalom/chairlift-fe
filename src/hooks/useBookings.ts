import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/chairlift-api';
import { CreateBookingRequest } from '../types/booking.types';

const BOOKINGS_QUERY_KEY = 'bookings';

export function useBookingDetails(id: string) {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, id, 'details'],
    queryFn: () => bookingsApi.getBookingDetails(id),
    enabled: !!id
  });
}

export function useCustomerBookings(customerId: string) {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, 'customer', customerId],
    queryFn: () => bookingsApi.listCustomerBookings(customerId),
    enabled: !!customerId
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.createBooking(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.customerId, 'dashboard'] });
    }
  });
}
