import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statusesApi } from '../api/statuses.api';
import {
  CreateStatusConfigRequest,
  UpdateStatusConfigRequest,
  ReorderStatusesRequest
} from '../types/status-config';

const STATUSES_QUERY_KEY = ['statuses'];
const STATUS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const STATUS_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export function useStatuses() {
  return useQuery({
    queryKey: STATUSES_QUERY_KEY,
    queryFn: statusesApi.listStatuses,
    staleTime: STATUS_STALE_TIME,
    gcTime: STATUS_CACHE_TIME
  });
}

export function useStatus(statusKey: string) {
  return useQuery({
    queryKey: [...STATUSES_QUERY_KEY, statusKey],
    queryFn: () => statusesApi.getStatus(statusKey),
    staleTime: STATUS_STALE_TIME,
    gcTime: STATUS_CACHE_TIME,
    enabled: !!statusKey
  });
}

export function useCreateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateStatusConfigRequest) =>
      statusesApi.createStatus(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATUSES_QUERY_KEY });
    }
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ statusKey, request }: { statusKey: string; request: UpdateStatusConfigRequest }) =>
      statusesApi.updateStatus(statusKey, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STATUSES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...STATUSES_QUERY_KEY, variables.statusKey] });
    }
  });
}

export function useDeleteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statusKey: string) => statusesApi.deleteStatus(statusKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATUSES_QUERY_KEY });
    }
  });
}

export function useReorderStatuses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ReorderStatusesRequest) =>
      statusesApi.reorderStatuses(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATUSES_QUERY_KEY });
    }
  });
}
