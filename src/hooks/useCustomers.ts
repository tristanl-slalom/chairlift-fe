import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../api/chairlift-api';
import { UpdateCustomerRequest } from '../types/customer.types';

const CUSTOMERS_QUERY_KEY = 'customers';

export function useCustomer(id: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, id],
    queryFn: () => customersApi.getCustomer(id),
    enabled: !!id
  });
}

export function useCustomerDashboard(id: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, id, 'dashboard'],
    queryFn: () => customersApi.getCustomerDashboard(id),
    enabled: !!id
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, variables.id, 'dashboard'] });
    }
  });
}
