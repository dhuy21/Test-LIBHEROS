<script setup lang="ts">
defineProps<{ message: string }>();
defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click.self="$emit('cancel')"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
      <p class="text-gray-800 text-lg mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          @click="$emit('cancel')"
        >
          Annuler
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          @click="$emit('confirm')"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>
