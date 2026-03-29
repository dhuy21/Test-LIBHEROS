import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import type { User, AuthResponse } from '../types';

const user = ref<User | null>(null);
const token = ref<string | null>(null);

// Charger depuis localStorage au démarrage
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');
if (savedUser && savedToken) {
  user.value = JSON.parse(savedUser);
  token.value = savedToken;
}

export function useAuth() {
  const router = useRouter();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        firstName, lastName, email, password,
      });
      user.value = data.user;
      token.value = data.accessToken;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.accessToken);
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      error.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Erreur lors de l\'inscription');
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
      user.value = data.user;
      token.value = data.accessToken;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.accessToken);
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      error.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Erreur lors de la connexion');
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return { user, token, loading, error, register, login, logout };
}
