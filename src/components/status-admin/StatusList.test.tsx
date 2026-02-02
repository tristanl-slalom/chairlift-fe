import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatusList from './StatusList';
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

// Mock @dnd-kit/core
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: () => [],
}));

describe('StatusList', () => {
  const mockStatuses: StatusConfig[] = [
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
  ];

  const mockTaskCounts = {
    'TODO': 5,
    'IN_PROGRESS': 3,
    'DONE': 10
  };

  it('shows loading state', () => {
    const mockOnReorder = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <StatusList
        statuses={[]}
        taskCounts={{}}
        onReorder={mockOnReorder}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );

    // Should render skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no statuses exist', () => {
    const mockOnReorder = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <StatusList
        statuses={[]}
        taskCounts={{}}
        onReorder={mockOnReorder}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={false}
      />
    );

    expect(screen.getByText('No custom statuses yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first custom status to get started')).toBeInTheDocument();
  });

  it('renders all statuses', () => {
    const mockOnReorder = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <StatusList
        statuses={mockStatuses}
        taskCounts={mockTaskCounts}
        onReorder={mockOnReorder}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={false}
      />
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('passes task counts to status items', () => {
    const mockOnReorder = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <StatusList
        statuses={mockStatuses}
        taskCounts={mockTaskCounts}
        onReorder={mockOnReorder}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={false}
      />
    );

    expect(screen.getByText('5 tasks using this')).toBeInTheDocument();
    expect(screen.getByText('3 tasks using this')).toBeInTheDocument();
    expect(screen.getByText('10 tasks using this')).toBeInTheDocument();
  });

  it('renders status items with correct data attributes', () => {
    const mockOnReorder = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <StatusList
        statuses={mockStatuses}
        taskCounts={mockTaskCounts}
        onReorder={mockOnReorder}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={false}
      />
    );

    const statusItems = screen.getAllByTestId('status-item');
    expect(statusItems.length).toBe(3);
  });
});
