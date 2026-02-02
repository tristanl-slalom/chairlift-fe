import { TaskStatus } from '../../types/task';
import { useStatuses } from '../../hooks/useStatuses';

interface TaskFiltersProps {
  selectedStatus: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  taskCounts: Record<string, number>;
}

export default function TaskFilters({ selectedStatus, onStatusChange, taskCounts }: TaskFiltersProps) {
  const { data: statuses = [], isLoading } = useStatuses();

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  const filters: Array<{ value: string; label: string }> = [
    { value: 'ALL', label: 'All' },
    ...statuses
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(s => ({ value: s.statusKey, label: s.displayName }))
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedStatus === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white bg-opacity-20">
              {taskCounts[filter.value]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
