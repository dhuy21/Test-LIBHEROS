<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';

const emit = defineEmits<{
  create: [shortDescription: string, dueDate: string, longDescription?: string];
}>();

const shortDescription = ref('');
const longDescription = ref('');
const dueDate = ref('');

const handleSubmit = () => {
  if (!shortDescription.value.trim() || !dueDate.value) return;
  emit(
    'create',
    shortDescription.value.trim(),
    dueDate.value,
    longDescription.value.trim() || undefined,
  );
  // Reset le formulaire
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
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
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
