<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus } from 'lucide-vue-next';

const today = computed(() => new Date().toISOString().split('T')[0]);

const emit = defineEmits<{
  create: [shortDescription: string, dueDate: string | undefined, longDescription?: string];
}>();

const shortDescription = ref('');
const longDescription = ref('');
const dueDate = ref('');

const handleSubmit = () => {
  if (!shortDescription.value.trim()) return;
  emit(
    'create',
    shortDescription.value.trim(),
    dueDate.value || undefined,
    longDescription.value.trim() || undefined,
  );
  shortDescription.value = '';
  longDescription.value = '';
  dueDate.value = '';
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
    <div class="flex flex-col gap-3">
      <input
        v-model="shortDescription"
        type="text"
        placeholder="Nouvelle tâche..."
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        required
      />
      <textarea
        v-model="longDescription"
        placeholder="Description détaillée (optionnel)"
        rows="2"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
      />
      <div class="flex items-center gap-3">
        <input
          v-model="dueDate"
          type="date"
          :min="today"
          placeholder="Date d'échéance (optionnel)"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          class="ml-auto flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          <Plus class="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </div>
  </form>
</template>
