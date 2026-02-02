import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskItem from './TaskItem';
import { Task } from '../../types/task';
import * as statusesApi from '../../api/statuses.api';

// Mock the statusesApi
vi.mock('../../api/statuses.api');

describe('TaskItem', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock the listStatuses API call
    vi.mocked(statusesApi.statusesApi.listStatuses).mockResolvedValue([
      {
        statusKey: 'TODO',
        displayName: 'To Do',
        displayOrder: 0,
        color: '#6B7280',
        icon: '📋',
        isDefault: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        statusKey: 'IN_PROGRESS',
        displayName: 'In Progress',
        displayOrder: 10,
        color: '#3B82F6',
        icon: '🔄',
        isDefault: false,
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        statusKey: 'DONE',
        displayName: 'Done',
        displayOrder: 20,
        color: '#10B981',
        icon: '✅',
        isDefault: false,
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]);
  });

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };

  const mockOnStatusChange = vi.fn();
  const mockOnDelete = vi.fn();

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('renders task information', async () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders without description', async () => {
    const taskWithoutDesc = { ...mockTask, description: '' };
    renderWithProvider(
      <TaskItem
        task={taskWithoutDesc}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});
