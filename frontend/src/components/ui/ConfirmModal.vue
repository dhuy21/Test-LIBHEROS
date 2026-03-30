<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

defineProps<{ message: string }>();
const emit = defineEmits<{ confirm: []; cancel: [] }>();

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('cancel');
};

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <div
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      @click.self="$emit('cancel')"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 animate-scale-in">
        <p class="text-gray-800 text-lg mb-6">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
            @click="$emit('cancel')"
          >
            Annuler
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-[0.98] transition-all"
            @click="$emit('confirm')"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-out;
}
.animate-scale-in {
  animation: scaleIn 0.15s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
