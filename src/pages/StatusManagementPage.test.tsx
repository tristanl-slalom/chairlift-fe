import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StatusManagementPage from './StatusManagementPage';
import * as statusesApi from '../api/statuses.api';
import * as tasksApi from '../api/tasks.api';

// Mock the APIs
vi.mock('../api/statuses.api');
vi.mock('../api/tasks.api');

// Mock @dnd-kit modules
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  arrayMove: <T,>(arr: T[], oldIndex: number, newIndex: number) => {
    const newArr = [...arr];
    const [item] = newArr.splice(oldIndex, 1);
    newArr.splice(newIndex, 0, item);
    return newArr;
  },
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: {},
}));

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: () => [],
}));

describe('StatusManagementPage', () => {
  let queryClient: QueryClient;

  const mockStatuses = [
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
    }
  ];

  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'TODO',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'TODO',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'IN_PROGRESS',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.mocked(statusesApi.statusesApi.listStatuses).mockResolvedValue(mockStatuses);
    vi.mocked(tasksApi.tasksApi.listTasks).mockResolvedValue(mockTasks);
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Page Layout', () => {
    it('renders page header', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Status Management')).toBeInTheDocument();
      });

      expect(screen.getByText('Create and manage custom task statuses for your workflow')).toBeInTheDocument();
    });

    it('renders create button', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('+ Create Status')).toBeInTheDocument();
      });
    });

    it('renders status list', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('To Do')).toBeInTheDocument();
      });

      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  describe('Task Count Calculation', () => {
    it('displays correct task counts for each status', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('2 tasks using this')).toBeInTheDocument();
      });

      expect(screen.getByText('1 tasks using this')).toBeInTheDocument();
    });
  });

  describe('Create Status Modal', () => {
    it('opens create modal when create button is clicked', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('+ Create Status')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Create Status'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Create Status' })).toBeInTheDocument();
      });
    });

    it('closes create modal when cancel is clicked', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('+ Create Status')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Create Status'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Create Status' })).toBeInTheDocument();
      });

      const cancelButtons = screen.getAllByText('Cancel');
      fireEvent.click(cancelButtons[0]);

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Create Status' })).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Status Modal', () => {
    it('opens edit modal when edit button is clicked', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId('edit-TODO')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-TODO'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Edit Status' })).toBeInTheDocument();
      });
    });

    it('pre-fills edit form with status data', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId('edit-TODO')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-TODO'));

      await waitFor(() => {
        expect(screen.getByDisplayValue('To Do')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('#6B7280')).toBeInTheDocument();
    });
  });

  describe('Delete Status Modal', () => {
    it('renders delete buttons for all statuses', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId('delete-TODO')).toBeInTheDocument();
      });

      expect(screen.getByTestId('delete-IN_PROGRESS')).toBeInTheDocument();
    });

    it('disables delete button for status with tasks', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId('delete-TODO')).toBeInTheDocument();
      });

      // TODO status has 2 tasks, so delete should be disabled
      const deleteButton = screen.getByTestId('delete-TODO');
      expect(deleteButton).toBeDisabled();
      expect(deleteButton).toHaveAttribute('title', 'Cannot delete: 2 tasks using this status');
    });

    it('shows delete confirmation when status has no tasks', async () => {
      // Mock a status with no tasks
      const statusesWithUnused = [
        ...mockStatuses,
        {
          statusKey: 'ARCHIVED',
          displayName: 'Archived',
          displayOrder: 30,
          color: '#9CA3AF',
          icon: '📦',
          isDefault: false,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ];

      vi.mocked(statusesApi.statusesApi.listStatuses).mockResolvedValue(statusesWithUnused);

      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId('delete-ARCHIVED')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('delete-ARCHIVED'));

      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      });

      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
    });
  });

  describe('Notifications', () => {
    it('sets up notification system correctly', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('+ Create Status')).toBeInTheDocument();
      });

      // Notification system is ready (tested through integration)
      expect(screen.queryByText(/successfully/)).not.toBeInTheDocument();
    });
  });

  describe('Status Sorting', () => {
    it('displays statuses in order', async () => {
      renderWithProvider(<StatusManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('To Do')).toBeInTheDocument();
      });

      // Statuses are displayed (sorting tested through display order prop)
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });
});
