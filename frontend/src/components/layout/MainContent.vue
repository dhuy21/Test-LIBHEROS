<script setup lang="ts">
defineProps<{
  selectedListId: number | null;
  selectedTaskId: number | null;
}>();

defineEmits<{
  'select-task': [id: number];
}>();
</script>

<template>
  <main class="flex-1 p-6 overflow-y-auto">
    <div v-if="!selectedListId" class="flex items-center justify-center h-full">
      <p class="text-gray-400 text-lg">Sélectionnez une liste pour voir les tâches</p>
    </div>
    <div v-else>
      <p class="text-gray-500">Tâches de la liste #{{ selectedListId }} — à implémenter (JOUR 3)</p>
    </div>
  </main>
</template>
