<script setup lang="ts">
import type { Task } from '../../types';

defineProps<{
  task: Task;
  isSelected: boolean;
}>();

defineEmits<{
  select: [id: number];
  toggle: [id: number, isCompleted: boolean];
}>();

const isOverdue = (date: string | null, completed: boolean) => {
  if (!date || completed) return false;
  return new Date(date) < new Date(new Date().toDateString());
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
};
</script>

<template>
  <div
    role="button"
    tabindex="0"
    @click="$emit('select', task.id)"
    @keydown.enter="$emit('select', task.id)"
    :class="[
      'flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors',
      isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent',
    ]"
  >
    <input
      type="checkbox"
      :checked="task.isCompleted"
      @click.stop="$emit('toggle', task.id, !task.isCompleted)"
      class="w-5 h-5 accent-blue-600 shrink-0 focus:ring-2 focus:ring-blue-500 rounded"
    />
    <span
      :class="['flex-1 text-sm', task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800']"
    >
      {{ task.shortDescription }}
    </span>
    <span
      v-if="task.dueDate"
      :class="['text-xs shrink-0', isOverdue(task.dueDate, task.isCompleted) ? 'text-red-500 font-medium' : 'text-gray-400']"
    >
      {{ formatDate(task.dueDate) }}
    </span>
  </div>
</template>
