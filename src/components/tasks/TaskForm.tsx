import { useState, FormEvent, useEffect } from 'react';
import { CreateTaskRequest, TaskStatus } from '../../types/task';
import { useStatuses } from '../../hooks/useStatuses';

interface TaskFormProps {
  onSubmit: (task: CreateTaskRequest) => void;
  isSubmitting?: boolean;
}

export default function TaskForm({ onSubmit, isSubmitting }: TaskFormProps) {
  const { data: statuses = [], isLoading } = useStatuses();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('');

  // Set default status when statuses are loaded
  useEffect(() => {
    if (statuses.length > 0 && !status) {
      const defaultStatus = statuses.find(s => s.isDefault);
      setStatus(defaultStatus?.statusKey || statuses[0].statusKey);
    }
  }, [statuses, status]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title: title.trim(), description: description.trim(), status });
      setTitle('');
      setDescription('');
      // Reset to default status
      const defaultStatus = statuses.find(s => s.isDefault);
      setStatus(defaultStatus?.statusKey || statuses[0]?.statusKey || '');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Enter task title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          disabled={isSubmitting}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Enter task description"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          disabled={isSubmitting || isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          {isLoading ? (
            <option>Loading statuses...</option>
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
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
