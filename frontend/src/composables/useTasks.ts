import { ref } from 'vue';
import api from '../services/api';
import type { Task } from '../types';

// État partagé entre MainContent et RightSidebar
const tasks = ref<Task[]>([]);
const selectedTask = ref<Task | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useTasks() {

  const fetchTasks = async (listId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<Task[]>(`/task-lists/${listId}/tasks`);
      tasks.value = data;
    } catch {
      tasks.value = [];
      error.value = 'Erreur lors du chargement des tâches';
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (
    listId: number,
    shortDescription: string,
    dueDate: string,
    longDescription?: string,
  ) => {
    error.value = null;
    try {
      const payload: Record<string, string> = { shortDescription, dueDate };
      if (longDescription) payload.longDescription = longDescription;
      await api.post(`/task-lists/${listId}/tasks`, payload);
      await fetchTasks(listId);
    } catch {
      error.value = 'Erreur lors de la création';
      await fetchTasks(listId);
    }
  };

  const fetchTaskDetail = async (taskId: number) => {
    selectedTask.value = null;
    try {
      const { data } = await api.get<Task>(`/tasks/${taskId}`);
      selectedTask.value = data;
    } catch {
      selectedTask.value = null;
    }
  };

  const updateTask = async (taskId: number, data: Partial<Pick<Task, 'shortDescription' | 'longDescription' | 'dueDate' | 'isCompleted'>>, listId: number) => {
    error.value = null;
    try {
      await api.patch(`/tasks/${taskId}`, data);
      await fetchTasks(listId);
      if (selectedTask.value?.id === taskId) {
        await fetchTaskDetail(taskId);
      }
      return true;
    } catch {
      error.value = 'Erreur lors de la mise à jour';
      return false;
    }
  };

  const toggleTask = async (taskId: number, isCompleted: boolean, listId: number) => {
    error.value = null;
    try {
      await api.patch(`/tasks/${taskId}`, { isCompleted });
      await fetchTasks(listId);
      if (selectedTask.value?.id === taskId) {
        selectedTask.value = { ...selectedTask.value, isCompleted };
      }
    } catch {
      error.value = 'Erreur lors de la mise à jour';
      await fetchTasks(listId);
    }
  };

  const deleteTask = async (taskId: number, listId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks(listId);
      return true;
    } catch {
      error.value = 'Erreur lors de la suppression';
      return false;
    }
  };

  return {
    tasks, selectedTask, loading, error,
    fetchTasks, createTask, fetchTaskDetail, updateTask, toggleTask, deleteTask,
  };
}
