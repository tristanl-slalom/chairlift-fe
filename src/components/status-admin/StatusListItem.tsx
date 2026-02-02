import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StatusConfig } from '../../types/status-config';

interface StatusListItemProps {
  status: StatusConfig;
  taskCount?: number;
  onEdit: (status: StatusConfig) => void;
  onDelete: (statusKey: string) => void;
}

export default function StatusListItem({ status, taskCount = 0, onEdit, onDelete }: StatusListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.statusKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 ${
        isDragging ? 'shadow-xl z-50' : 'shadow-sm'
      }`}
      data-status-key={status.statusKey}
      data-testid="status-item"
    >
      <div className="flex items-center gap-4">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </button>

        {/* Status info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{status.icon}</span>
            <div>
              <h3 className="font-medium text-gray-900">{status.displayName}</h3>
              <p className="text-sm text-gray-500 font-mono">{status.statusKey}</p>
            </div>
            {status.isDefault && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                Default
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Order: {status.displayOrder}</span>
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded"
              style={{ backgroundColor: status.color + '20', color: status.color }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
              {status.color}
            </span>
            {taskCount > 0 && (
              <span className="text-gray-500">{taskCount} tasks using this</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(status)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            data-testid={`edit-${status.statusKey}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(status.statusKey)}
            disabled={taskCount > 0}
            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid={`delete-${status.statusKey}`}
            title={taskCount > 0 ? `Cannot delete: ${taskCount} tasks using this status` : 'Delete status'}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
