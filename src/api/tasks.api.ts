import axios from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const tasksApi = {
  async createTask(request: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', request);
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async listTasks(status?: TaskStatus): Promise<Task[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<Task[]>('/tasks', { params });
    return response.data;
  },

  async updateTask(id: string, request: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, request);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }
};
