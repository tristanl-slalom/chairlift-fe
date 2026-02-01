import { useState, useMemo } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { TaskStatus, CreateTaskRequest } from '../types/task';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';

export default function TasksPage() {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');

  const { data: tasks = [], isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const filteredTasks = useMemo(() => {
    if (filterStatus === 'ALL') return tasks;
    return tasks.filter((task) => task.status === filterStatus);
  }, [tasks, filterStatus]);

  const taskCounts = useMemo(() => {
    const counts = {
      ALL: tasks.length,
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0
    };

    tasks.forEach((task) => {
      counts[task.status]++;
    });

    return counts;
  }, [tasks]);

  const handleCreateTask = async (request: CreateTaskRequest) => {
    try {
      await createTask.mutateAsync(request);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ id, request: { status } });
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Concepto Task Manager</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </header>

      <TaskForm onSubmit={handleCreateTask} isSubmitting={createTask.isPending} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold">Error: </strong>
          <span>Failed to load tasks. Please try again later.</span>
        </div>
      )}

      <TaskFilters
        selectedStatus={filterStatus}
        onStatusChange={setFilterStatus}
        taskCounts={taskCounts}
      />

      <TaskList
        tasks={filteredTasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
        isLoading={isLoading}
      />
    </div>
  );
}
