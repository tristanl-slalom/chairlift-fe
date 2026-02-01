import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../types/task';

const TASKS_QUERY_KEY = 'tasks';

export function useTasks(status?: TaskStatus) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, status],
    queryFn: () => tasksApi.listTasks(status)
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTaskRequest) => tasksApi.createTask(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateTaskRequest }) =>
      tasksApi.updateTask(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    }
  });
}
