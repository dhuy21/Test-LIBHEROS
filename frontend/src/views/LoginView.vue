<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const { loading, error, login } = useAuth();

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  login(email.value, password.value);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Connexion</h1>

      <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="exemple@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Pas encore de compte ?
        <RouterLink to="/register" class="text-blue-600 hover:underline">S'inscrire</RouterLink>
      </p>
    </div>
  </div>
</template>
