import { ref } from 'vue';
import api from '../services/api';
import type { Task } from '../types';

// État partagé entre MainContent et RightSidebar
const tasks = ref<Task[]>([]);
const selectedTask = ref<Task | null>(null);
const loading = ref(false);

export function useTasks() {

  const fetchTasks = async (listId: number) => {
    loading.value = true;
    try {
      const { data } = await api.get<Task[]>(`/task-lists/${listId}/tasks`);
      tasks.value = data;
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
    await api.post(`/task-lists/${listId}/tasks`, {
      shortDescription,
      dueDate,
      longDescription,
    });
    await fetchTasks(listId);
  };

  const fetchTaskDetail = async (taskId: number) => {
    const { data } = await api.get<Task>(`/tasks/${taskId}`);
    selectedTask.value = data;
  };

  const toggleTask = async (taskId: number, isCompleted: boolean, listId: number) => {
    await api.patch(`/tasks/${taskId}`, { isCompleted });
    await fetchTasks(listId);
    // Rafraîchir le détail si c'est la tâche affichée
    if (selectedTask.value?.id === taskId) {
      selectedTask.value = { ...selectedTask.value, isCompleted };
    }
  };

  const deleteTask = async (taskId: number, listId: number) => {
    await api.delete(`/tasks/${taskId}`);
    await fetchTasks(listId);
  };

  return {
    tasks, selectedTask, loading,
    fetchTasks, createTask, fetchTaskDetail, toggleTask, deleteTask,
  };
}
