import { ref } from 'vue';
import api from '../services/api';
import type { TaskList } from '../types';

export function useTaskLists() {
  const lists = ref<TaskList[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchLists = async () => {
    loading.value = true;
    try {
      const { data } = await api.get<TaskList[]>('/task-lists');
      lists.value = data;
    } catch {
      error.value = 'Erreur lors du chargement';
    } finally {
      loading.value = false;
    }
  };

  const createList = async (name: string) => {
    error.value = null;
    try {
      await api.post('/task-lists', { name });
      await fetchLists();
      return true;
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { message?: string | string[] } } };
      const msg = ax.response?.data?.message;
      const text = Array.isArray(msg) ? msg.join(', ') : msg;
      error.value =
        ax.response?.status === 409
          ? 'Ce nom existe déjà'
          : text || 'Erreur lors de la création';
      return false;
    }
  };

  const deleteList = async (id: number) => {
    try {
      await api.delete(`/task-lists/${id}`);
      await fetchLists();
      return true;
    } catch {
      error.value = 'Erreur lors de la suppression';
      return false;
    }
  };

  return { lists, loading, error, fetchLists, createList, deleteList };
}
