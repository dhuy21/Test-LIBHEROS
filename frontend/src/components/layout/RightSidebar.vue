<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Trash2 } from 'lucide-vue-next';
import { useTasks } from '../../composables/useTasks';
import ConfirmModal from '../ui/ConfirmModal.vue';

const props = defineProps<{ taskId: number }>();
const emit = defineEmits<{ close: []; 'task-deleted': [] }>();

const { selectedTask, fetchTaskDetail, deleteTask } = useTasks();
const showDeleteModal = ref(false);

// Charger le détail quand on sélectionne une tâche
watch(
  () => props.taskId,
  (id) => fetchTaskDetail(id),
  { immediate: true },
);

const confirmDelete = async () => {
  if (!selectedTask.value) return;
  const ok = await deleteTask(selectedTask.value.id, selectedTask.value.taskListId);
  showDeleteModal.value = false;
  if (ok) {
    emit('task-deleted');
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
</script>

<template>
  <aside class="w-80 shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="font-semibold text-gray-800">Détail de la tâche</h2>
      <button @click="emit('close')" class="p-1 hover:bg-gray-100 rounded">
        <X class="w-5 h-5 text-gray-500" />
      </button>
    </div>

    <div v-if="selectedTask" class="p-4 flex-1 flex flex-col gap-4">
      <!-- Description courte -->
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Description</label>
        <p class="text-gray-800 mt-1">{{ selectedTask.shortDescription }}</p>
      </div>

      <!-- Description longue -->
      <div v-if="selectedTask.longDescription">
        <label class="text-xs text-gray-500 uppercase tracking-wide">Description détaillée</label>
        <p class="text-gray-600 mt-1 text-sm whitespace-pre-wrap">{{ selectedTask.longDescription }}</p>
      </div>

      <!-- Date d'échéance -->
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Date d'échéance</label>
        <p class="text-gray-800 mt-1 text-sm">{{ formatDate(selectedTask.dueDate) }}</p>
      </div>

      <!-- Statut -->
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Statut</label>
        <p class="mt-1 text-sm">
          <span
            :class="selectedTask.isCompleted ? 'text-green-600' : 'text-orange-500'"
          >
            {{ selectedTask.isCompleted ? 'Terminée' : 'En cours' }}
          </span>
        </p>
      </div>

      <!-- Date de création -->
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Date de création</label>
        <p class="text-gray-800 mt-1 text-sm">{{ formatDate(selectedTask.createdAt) }}</p>
      </div>

      <!-- Bouton supprimer -->
      <button
        @click="showDeleteModal = true"
        class="mt-auto flex items-center justify-center gap-2 w-full py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
      >
        <Trash2 class="w-4 h-4" />
        Supprimer cette tâche
      </button>
    </div>

    <!-- Modal de confirmation -->
    <ConfirmModal
      v-if="showDeleteModal"
      message="Voulez-vous vraiment supprimer cette tâche ?"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </aside>
</template>
