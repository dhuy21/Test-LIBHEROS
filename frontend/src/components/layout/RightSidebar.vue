<script setup lang="ts">
defineProps<{ taskId: number }>();
defineEmits<{ close: []; taskDeleted: [] }>();
</script>

<template>
  <aside class="w-80 shrink-0 border-l border-gray-200 bg-gray-50 p-4 flex flex-col">
    <p class="text-sm text-gray-500">Détail tâche #{{ taskId }} — JOUR 3</p>
    <button
      type="button"
      class="mt-4 text-sm text-blue-600 hover:underline self-start"
      @click="$emit('close')"
    >
      Fermer
    </button>
  </aside>
</template>
