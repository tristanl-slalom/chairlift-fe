import { Task, TaskStatus } from '../../types/task';
import { useStatuses } from '../../hooks/useStatuses';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const { data: statuses = [], isLoading } = useStatuses();

  const currentStatus = statuses.find(s => s.statusKey === task.status);
  const color = currentStatus?.color || '#6B7280';
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mb-3">{task.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            {task.updatedAt !== task.createdAt && (
              <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            disabled={isLoading}
            className="px-3 py-1 rounded-full text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: `${color}20`,
              color: color
            }}
          >
            {isLoading ? (
              <option>Loading...</option>
            ) : (
              statuses
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map(s => (
                  <option key={s.statusKey} value={s.statusKey}>
                    {s.icon} {s.displayName}
                  </option>
                ))
            )}
          </select>

          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
