<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { X, Trash2, Pencil, Save } from 'lucide-vue-next';
import { useTasks } from '../../composables/useTasks';
import ConfirmModal from '../ui/ConfirmModal.vue';

const today = computed(() => new Date().toISOString().split('T')[0]);

const props = defineProps<{ taskId: number }>();
const emit = defineEmits<{ close: []; 'task-deleted': [] }>();

const { selectedTask, error, fetchTaskDetail, updateTask, deleteTask } = useTasks();
const showDeleteModal = ref(false);
const editing = ref(false);
const editForm = ref({ shortDescription: '', longDescription: '', dueDate: '' });

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return;
  if (showDeleteModal.value) return;
  if (editing.value) {
    editing.value = false;
    return;
  }
  emit('close');
};

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));

watch(
  () => props.taskId,
  (id) => {
    editing.value = false;
    fetchTaskDetail(id);
  },
  { immediate: true },
);

const startEdit = () => {
  if (!selectedTask.value) return;
  editForm.value = {
    shortDescription: selectedTask.value.shortDescription,
    longDescription: selectedTask.value.longDescription || '',
    dueDate: selectedTask.value.dueDate || '',
  };
  editing.value = true;
};

const saveEdit = async () => {
  if (!selectedTask.value || !editForm.value.shortDescription.trim()) return;
  const ok = await updateTask(
    selectedTask.value.id,
    {
      shortDescription: editForm.value.shortDescription.trim(),
      longDescription: editForm.value.longDescription.trim() || null,
      dueDate: editForm.value.dueDate || null,
    },
    selectedTask.value.taskListId,
  );
  if (ok) editing.value = false;
};

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
      <div class="flex items-center gap-1">
        <button
          v-if="selectedTask && !editing"
          @click="startEdit"
          class="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Modifier"
        >
          <Pencil class="w-4 h-4 text-gray-500" />
        </button>
        <button @click="emit('close')" class="p-1 hover:bg-gray-100 rounded transition-colors">
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="mx-4 mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="!selectedTask && !error" class="flex items-center justify-center py-12">
      <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Mode édition -->
    <form v-else-if="editing" @submit.prevent="saveEdit" class="p-4 flex-1 flex flex-col gap-4">
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Description courte</label>
        <input
          v-model="editForm.shortDescription"
          type="text"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm hover:border-gray-400 transition-shadow duration-150"
          required
        />
      </div>
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Description longue</label>
        <textarea
          v-model="editForm.longDescription"
          rows="3"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none hover:border-gray-400 transition-shadow duration-150"
          placeholder="Optionnel"
        />
      </div>
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Date d'échéance</label>
        <input
          v-model="editForm.dueDate"
          type="date"
          :min="today"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm hover:border-gray-400 transition-shadow duration-150"
        />
      </div>
      <div class="flex gap-2 mt-auto">
        <button
          type="submit"
          class="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <Save class="w-4 h-4" />
          Enregistrer
        </button>
        <button
          type="button"
          @click="editing = false"
          class="flex-1 py-2 text-gray-600 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          Annuler
        </button>
      </div>
    </form>

    <!-- Mode lecture -->
    <div v-else-if="selectedTask" class="p-4 flex-1 flex flex-col gap-4">
      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Description courte</label>
        <p class="text-gray-800 mt-1">{{ selectedTask.shortDescription }}</p>
      </div>

      <div v-if="selectedTask.longDescription">
        <label class="text-xs text-gray-500 uppercase tracking-wide">Description longue</label>
        <p class="text-gray-600 mt-1 text-sm whitespace-pre-wrap">{{ selectedTask.longDescription }}</p>
      </div>

      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Date d'échéance</label>
        <p class="text-gray-800 mt-1 text-sm">
          {{ selectedTask.dueDate ? formatDate(selectedTask.dueDate) : 'Non définie' }}
        </p>
      </div>

      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Statut</label>
        <p class="mt-1">
          <span
            :class="[
              'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
              selectedTask.isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            ]"
          >
            {{ selectedTask.isCompleted ? 'Terminée' : 'En cours' }}
          </span>
        </p>
      </div>

      <div>
        <label class="text-xs text-gray-500 uppercase tracking-wide">Date de création</label>
        <p class="text-gray-800 mt-1 text-sm">{{ formatDate(selectedTask.createdAt) }}</p>
      </div>

      <button
        @click="showDeleteModal = true"
        class="mt-auto flex items-center justify-center gap-2 w-full py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 active:scale-[0.98] transition-all"
      >
        <Trash2 class="w-4 h-4" />
        Supprimer cette tâche
      </button>
    </div>

    <ConfirmModal
      v-if="showDeleteModal"
      message="Voulez-vous vraiment supprimer cette tâche ?"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </aside>
</template>
