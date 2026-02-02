import { useState, useMemo } from 'react';
import { useStatuses, useCreateStatus, useUpdateStatus, useDeleteStatus, useReorderStatuses } from '../hooks/useStatuses';
import { useTasks } from '../hooks/useTasks';
import { StatusConfig, CreateStatusConfigRequest, UpdateStatusConfigRequest } from '../types/status-config';
import StatusList from '../components/status-admin/StatusList';
import StatusForm from '../components/status-admin/StatusForm';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export default function StatusManagementPage() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusConfig | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data fetching
  const { data: statuses = [], isLoading } = useStatuses();
  const { data: allTasks = [] } = useTasks();

  // Mutations
  const createStatus = useCreateStatus();
  const updateStatus = useUpdateStatus();
  const deleteStatus = useDeleteStatus();
  const reorderStatuses = useReorderStatuses();

  // Calculate task counts per status
  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTasks.forEach((task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
    });
    return counts;
  }, [allTasks]);

  // Handlers
  const handleCreate = () => {
    setModalMode('create');
    setSelectedStatus(null);
  };

  const handleEdit = (status: StatusConfig) => {
    setModalMode('edit');
    setSelectedStatus(status);
  };

  const handleDeleteClick = (statusKey: string) => {
    const status = statuses.find((s) => s.statusKey === statusKey);
    if (!status) return;

    setSelectedStatus(status);
    setModalMode('delete');
  };

  const handleCreateSubmit = async (data: CreateStatusConfigRequest) => {
    try {
      await createStatus.mutateAsync(data);
      setModalMode(null);
      showNotification('success', 'Status created successfully');
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to create status');
      throw error;
    }
  };

  const handleUpdateSubmit = async (data: UpdateStatusConfigRequest) => {
    if (!selectedStatus) return;

    try {
      await updateStatus.mutateAsync({ statusKey: selectedStatus.statusKey, request: data });
      setModalMode(null);
      showNotification('success', 'Status updated successfully');
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to update status');
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStatus) return;

    try {
      await deleteStatus.mutateAsync(selectedStatus.statusKey);
      setModalMode(null);
      showNotification('success', 'Status deleted successfully');
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to delete status');
    }
  };

  const handleReorder = async (reorderedStatuses: StatusConfig[]) => {
    try {
      await reorderStatuses.mutateAsync({
        statuses: reorderedStatuses.map((s) => ({
          statusKey: s.statusKey,
          displayOrder: s.displayOrder
        }))
      });
      showNotification('success', 'Status order updated');
    } catch {
      showNotification('error', 'Failed to reorder statuses');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const sortedStatuses = [...statuses].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Status Management</h1>
        <p className="text-gray-600">Create and manage custom task statuses for your workflow</p>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Create button */}
      <div className="mb-6">
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Status
        </button>
      </div>

      {/* Status list */}
      <StatusList
        statuses={sortedStatuses}
        taskCounts={taskCounts}
        onReorder={handleReorder}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* Create/Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setModalMode(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {modalMode === 'create' ? 'Create Status' : 'Edit Status'}
              </h2>
              <StatusForm
                mode={modalMode}
                existingStatus={selectedStatus || undefined}
                onSubmit={modalMode === 'create' ? handleCreateSubmit : handleUpdateSubmit}
                onCancel={() => setModalMode(null)}
                isSubmitting={createStatus.isPending || updateStatus.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && selectedStatus && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setModalMode(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Status</h2>

              {taskCounts[selectedStatus.statusKey] > 0 ? (
                <>
                  <p className="text-gray-700 mb-4">
                    Cannot delete this status because <strong>{taskCounts[selectedStatus.statusKey]} tasks</strong> are currently using it.
                  </p>
                  <p className="text-gray-600 text-sm mb-6">
                    Please reassign these tasks to another status before deleting.
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setModalMode(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete <strong>{selectedStatus.displayName}</strong>? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setModalMode(null)}
                      disabled={deleteStatus.isPending}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={deleteStatus.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleteStatus.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
