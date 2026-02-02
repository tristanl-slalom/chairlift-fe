import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StatusForm from './StatusForm';
import { StatusConfig } from '../../types/status-config';
import * as statusesApi from '../../api/statuses.api';

// Mock the statusesApi
vi.mock('../../api/statuses.api');

describe('StatusForm', () => {
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
      }
    ]);
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Create Mode', () => {
    it('renders create form with all fields', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Status Key *')).toBeInTheDocument();
      });

      expect(screen.getByText('Display Name *')).toBeInTheDocument();
      expect(screen.getByText('Color *')).toBeInTheDocument();
      expect(screen.getByText('Icon *')).toBeInTheDocument();
      expect(screen.getByText('Display Order')).toBeInTheDocument();
      expect(screen.getByText('Set as default status for new tasks')).toBeInTheDocument();
    });

    it('allows status key input', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('MY_STATUS')).toBeInTheDocument();
      });

      const statusKeyInput = screen.getByPlaceholderText('MY_STATUS');
      fireEvent.change(statusKeyInput, { target: { value: 'VALID_KEY' } });

      expect(statusKeyInput).toHaveValue('VALID_KEY');
    });

    it('renders status key field', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('MY_STATUS')).toBeInTheDocument();
      });

      const statusKeyInput = screen.getByPlaceholderText('MY_STATUS');
      expect(statusKeyInput).toHaveAttribute('maxLength', '50');
    });

    it('converts status key to uppercase', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('MY_STATUS')).toBeInTheDocument();
      });

      const statusKeyInput = screen.getByPlaceholderText('MY_STATUS');
      fireEvent.change(statusKeyInput, { target: { value: 'new_status' } });

      expect(statusKeyInput).toHaveValue('NEW_STATUS');
    });
  });

  describe('Edit Mode', () => {
    const existingStatus: StatusConfig = {
      statusKey: 'IN_PROGRESS',
      displayName: 'In Progress',
      displayOrder: 10,
      color: '#3B82F6',
      icon: '🔄',
      isDefault: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    it('does not show status key field in edit mode', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="edit"
          existingStatus={existingStatus}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Status Key *')).not.toBeInTheDocument();
      });
    });

    it('pre-fills form with existing status data', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="edit"
          existingStatus={existingStatus}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('#3B82F6')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('has display name field', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('My Status')).toBeInTheDocument();
      });

      const displayNameInput = screen.getByPlaceholderText('My Status');
      expect(displayNameInput).toHaveAttribute('maxLength', '50');
    });

    it('has color input field', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('#6B7280')).toBeInTheDocument();
      });

      const colorInput = screen.getByDisplayValue('#6B7280');
      expect(colorInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Form Actions', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('disables submit button when form is invalid', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Create Status')).toBeInTheDocument();
      });

      const submitButton = screen.getByText('Create Status');
      expect(submitButton).toBeDisabled();
    });

    it('shows loading state when submitting', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnCancel = vi.fn();

      renderWithProvider(
        <StatusForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
      });
    });
  });
});
