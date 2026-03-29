<script setup lang="ts">
import { computed, watch } from 'vue';
import { useTasks } from '../../composables/useTasks';
import TaskForm from '../tasks/TaskForm.vue';
import TaskItem from '../tasks/TaskItem.vue';
import CompletedTasks from '../tasks/CompletedTasks.vue';

const props = defineProps<{
  selectedListId: number | null;
  selectedTaskId: number | null;
}>();

const emit = defineEmits<{
  'select-task': [id: number];
}>();

const { tasks, loading, fetchTasks, createTask, toggleTask } = useTasks();

const activeTasks = computed(() => tasks.value.filter((t) => !t.isCompleted));
const completedTasks = computed(() => tasks.value.filter((t) => t.isCompleted));

// Recharger les tâches quand on change de liste
watch(
  () => props.selectedListId,
  (listId) => {
    if (listId) {
      fetchTasks(listId);
    }
  },
);

const handleCreate = async (shortDescription: string, dueDate: string, longDescription?: string) => {
  if (!props.selectedListId) return;
  await createTask(props.selectedListId, shortDescription, dueDate, longDescription);
};

const handleToggle = async (taskId: number, isCompleted: boolean) => {
  if (!props.selectedListId) return;
  await toggleTask(taskId, isCompleted, props.selectedListId);
};
</script>

<template>
  <main class="flex-1 p-6 overflow-y-auto">
    <!-- Aucune liste sélectionnée -->
    <div v-if="!selectedListId" class="flex items-center justify-center h-full">
      <p class="text-gray-400 text-lg">Sélectionnez une liste pour voir les tâches</p>
    </div>

    <div v-else>
      <!-- Formulaire de création -->
      <TaskForm @create="handleCreate" />

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-400">Chargement...</p>
      </div>

      <template v-else>
        <!-- Aucune tâche -->
        <p v-if="tasks.length === 0" class="text-center text-gray-400 py-8">
          Aucune tâche pour le moment. Créez-en une !
        </p>

        <!-- Tâches actives -->
        <div v-else class="space-y-1">
          <TaskItem
            v-for="task in activeTasks"
            :key="task.id"
            :task="task"
            :is-selected="selectedTaskId === task.id"
            @select="emit('select-task', $event)"
            @toggle="handleToggle"
          />

          <!-- Tâches terminées (masquées par défaut) -->
          <CompletedTasks
            :tasks="completedTasks"
            :selected-task-id="selectedTaskId"
            @select="emit('select-task', $event)"
            @toggle="handleToggle"
          />
        </div>
      </template>
    </div>
  </main>
</template>
