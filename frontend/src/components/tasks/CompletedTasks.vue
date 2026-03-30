<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import TaskItem from './TaskItem.vue';
import type { Task } from '../../types';

defineProps<{
  tasks: Task[];
  selectedTaskId: number | null;
}>();

defineEmits<{
  select: [id: number];
  toggle: [id: number, isCompleted: boolean];
}>();

const open = ref(false);
</script>

<template>
  <div v-if="tasks.length > 0" class="mt-6">
    <button
      @click="open = !open"
      class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
    >
      <ChevronDown
        :class="['w-4 h-4 transition-transform duration-200', open ? '' : '-rotate-90']"
      />
      Mes tâches terminées
      <span class="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium">
        {{ tasks.length }}
      </span>
    </button>

    <div v-show="open" class="mt-2 space-y-1">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-selected="selectedTaskId === task.id"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event, false)"
      />
    </div>
  </div>
</template>
