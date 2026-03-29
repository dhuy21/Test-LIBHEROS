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
      class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
    >
      <ChevronDown
        :class="['w-4 h-4 transition-transform', open ? '' : '-rotate-90']"
      />
      Mes tâches terminées ({{ tasks.length }})
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
