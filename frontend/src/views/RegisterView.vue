<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const { loading, error, register } = useAuth();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const confirmEmail = ref('');
const password = ref('');
const confirmPassword = ref('');

const emailMatch = computed(() => email.value === confirmEmail.value);
const passwordMatch = computed(() => password.value === confirmPassword.value);

const canSubmit = computed(() =>
  firstName.value && lastName.value &&
  email.value && confirmEmail.value && emailMatch.value &&
  password.value && confirmPassword.value && passwordMatch.value &&
  password.value.length >= 6
);

const handleSubmit = () => {
  if (!canSubmit.value) return;
  register(firstName.value, lastName.value, email.value, password.value);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Inscription</h1>

      <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="confirmEmail" class="block text-sm font-medium text-gray-700 mb-1">Confirmer l'email</label>
          <input
            id="confirmEmail"
            v-model="confirmEmail"
            type="email"
            required
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              confirmEmail && !emailMatch ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="confirmEmail && !emailMatch" class="mt-1 text-sm text-red-500">Les emails ne correspondent pas</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="password && password.length < 6" class="mt-1 text-sm text-red-500">6 caractères minimum</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              confirmPassword && !passwordMatch ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="confirmPassword && !passwordMatch" class="mt-1 text-sm text-red-500">Les mots de passe ne correspondent pas</p>
        </div>

        <button
          type="submit"
          :disabled="loading || !canSubmit"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Déjà un compte ?
        <RouterLink to="/login" class="text-blue-600 hover:underline">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>
