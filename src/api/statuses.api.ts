import axios from 'axios';
import {
  StatusConfig,
  CreateStatusConfigRequest,
  UpdateStatusConfigRequest,
  ReorderStatusesRequest
} from '../types/status-config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const statusesApi = {
  async createStatus(request: CreateStatusConfigRequest): Promise<StatusConfig> {
    const response = await apiClient.post<StatusConfig>('/statuses', request);
    return response.data;
  },

  async getStatus(statusKey: string): Promise<StatusConfig> {
    const response = await apiClient.get<StatusConfig>(`/statuses/${statusKey}`);
    return response.data;
  },

  async listStatuses(): Promise<StatusConfig[]> {
    const response = await apiClient.get<StatusConfig[]>('/statuses');
    return response.data;
  },

  async updateStatus(statusKey: string, request: UpdateStatusConfigRequest): Promise<StatusConfig> {
    const response = await apiClient.put<StatusConfig>(`/statuses/${statusKey}`, request);
    return response.data;
  },

  async deleteStatus(statusKey: string): Promise<void> {
    await apiClient.delete(`/statuses/${statusKey}`);
  },

  async reorderStatuses(request: ReorderStatusesRequest): Promise<void> {
    await apiClient.post('/statuses/reorder', request);
  }
};
