import { Task, TaskStatus } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800'
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
};

export default function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
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
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="TODO">{statusLabels.TODO}</option>
            <option value="IN_PROGRESS">{statusLabels.IN_PROGRESS}</option>
            <option value="DONE">{statusLabels.DONE}</option>
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
