import { TaskStatus } from '../../types/task';

interface TaskFiltersProps {
  selectedStatus: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  taskCounts: Record<TaskStatus | 'ALL', number>;
}

export default function TaskFilters({ selectedStatus, onStatusChange, taskCounts }: TaskFiltersProps) {
  const filters: Array<{ value: TaskStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' }
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
