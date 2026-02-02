import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DndContext } from '@dnd-kit/core';
import StatusListItem from './StatusListItem';
import { StatusConfig } from '../../types/status-config';

// Mock @dnd-kit/sortable
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('StatusListItem', () => {
  const mockStatus: StatusConfig = {
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

  const defaultStatus: StatusConfig = {
    ...mockStatus,
    statusKey: 'TODO',
    displayName: 'To Do',
    displayOrder: 0,
    isDefault: true
  };

  it('renders status information', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('🔄')).toBeInTheDocument();
    expect(screen.getByText('Order: 10')).toBeInTheDocument();
    expect(screen.getByText('#3B82F6')).toBeInTheDocument();
  });

  it('shows default badge for default status', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={defaultStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('does not show default badge for non-default status', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    expect(screen.queryByText('Default')).not.toBeInTheDocument();
  });

  it('shows task count when tasks are using the status', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={5}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    expect(screen.getByText('5 tasks using this')).toBeInTheDocument();
  });

  it('does not show task count when no tasks are using the status', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    expect(screen.queryByText(/tasks using this/)).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    fireEvent.click(screen.getByTestId('edit-IN_PROGRESS'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockStatus);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    fireEvent.click(screen.getByTestId('delete-IN_PROGRESS'));
    expect(mockOnDelete).toHaveBeenCalledWith('IN_PROGRESS');
  });

  it('disables delete button when tasks are using the status', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={5}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    const deleteButton = screen.getByTestId('delete-IN_PROGRESS');
    expect(deleteButton).toBeDisabled();
  });

  it('enables delete button when no tasks are using the status', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    const deleteButton = screen.getByTestId('delete-IN_PROGRESS');
    expect(deleteButton).not.toBeDisabled();
  });

  it('has correct test id attributes', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <DndContext>
        <StatusListItem
          status={mockStatus}
          taskCount={0}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );

    expect(screen.getByTestId('status-item')).toBeInTheDocument();
    expect(screen.getByTestId('edit-IN_PROGRESS')).toBeInTheDocument();
    expect(screen.getByTestId('delete-IN_PROGRESS')).toBeInTheDocument();
  });
});
