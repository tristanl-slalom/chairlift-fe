import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { StatusConfig } from '../../types/status-config';
import StatusListItem from './StatusListItem';

interface StatusListProps {
  statuses: StatusConfig[];
  taskCounts: Record<string, number>;
  onReorder: (reorderedStatuses: StatusConfig[]) => void;
  onEdit: (status: StatusConfig) => void;
  onDelete: (statusKey: string) => void;
  isLoading?: boolean;
}

export default function StatusList({ statuses, taskCounts, onReorder, onEdit, onDelete, isLoading }: StatusListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = statuses.findIndex((s) => s.statusKey === active.id);
      const newIndex = statuses.findIndex((s) => s.statusKey === over.id);

      const reordered = arrayMove(statuses, oldIndex, newIndex);

      // Recalculate display order
      const updated = reordered.map((status, index) => ({
        ...status,
        displayOrder: index * 10
      }));

      onReorder(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-24 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (statuses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <span className="text-4xl mb-3 block">📋</span>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No custom statuses yet</h3>
        <p className="text-gray-600">Create your first custom status to get started</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={statuses.map((s) => s.statusKey)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {statuses.map((status) => (
            <StatusListItem
              key={status.statusKey}
              status={status}
              taskCount={taskCounts[status.statusKey] || 0}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
