<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Menu, Plus, Trash2, LogOut, ChevronLeft } from 'lucide-vue-next';
import { useTaskLists } from '../../composables/useTaskLists';
import { useAuth } from '../../composables/useAuth';
import ConfirmModal from '../ui/ConfirmModal.vue';

const props = defineProps<{
  collapsed: boolean;
  selectedListId: number | null;
}>();

const emit = defineEmits<{
  toggle: [];
  'select-list': [id: number];
  'list-deleted': [];
}>();

const { lists, error, fetchLists, createList, deleteList } = useTaskLists();
const { user, logout } = useAuth();

const showCreateInput = ref(false);
const newListName = ref('');
const listToDelete = ref<number | null>(null);

onMounted(fetchLists);

const handleCreate = async () => {
  if (!newListName.value.trim()) return;
  const ok = await createList(newListName.value.trim());
  if (ok) {
    newListName.value = '';
    showCreateInput.value = false;
  }
};

const handleCreateButton = () => {
  if (props.collapsed) {
    emit('toggle');
    showCreateInput.value = true;
  } else {
    showCreateInput.value = !showCreateInput.value;
  }
};

const confirmDelete = async () => {
  if (listToDelete.value === null) return;
  const ok = await deleteList(listToDelete.value);
  if (ok && props.selectedListId === listToDelete.value) {
    emit('list-deleted');
  }
  listToDelete.value = null;
};
</script>

<template>
  <aside
    :class="collapsed ? 'w-16' : 'w-64'"
    class="h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-3 border-b border-gray-200">
      <button @click="emit('toggle')" class="p-2 hover:bg-gray-100 rounded-lg">
        <ChevronLeft v-if="!collapsed" class="w-5 h-5 text-gray-600" />
        <Menu v-else class="w-5 h-5 text-gray-600" />
      </button>
      <button
        @click="handleCreateButton"
        class="p-2 hover:bg-gray-100 rounded-lg"
        title="Nouvelle liste"
      >
        <Plus class="w-5 h-5 text-blue-600" />
      </button>
    </div>

    <!-- Formulaire création -->
    <div v-if="showCreateInput && !collapsed" class="p-3 border-b border-gray-200">
      <form @submit.prevent="handleCreate" class="flex gap-2">
        <input
          v-model="newListName"
          type="text"
          placeholder="Nom de la liste"
          class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          autofocus
        />
        <button type="submit" class="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          OK
        </button>
      </form>
      <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
    </div>

    <!-- Listes -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="list in lists"
        :key="list.id"
        @click="emit('select-list', list.id)"
        :class="[
          'flex items-center gap-2 px-3 py-2 cursor-pointer group',
          selectedListId === list.id
            ? 'bg-blue-50 border-l-2 border-blue-500'
            : 'hover:bg-gray-50 border-l-2 border-transparent'
        ]"
      >
        <span v-if="!collapsed" class="flex-1 text-sm text-gray-800 truncate">{{ list.name }}</span>
        <button
          v-if="!collapsed"
          @click.stop="listToDelete = list.id"
          class="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Footer : déconnexion -->
    <div class="p-3 border-t border-gray-200">
      <button
        @click="logout()"
        class="flex items-center gap-2 w-full p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <LogOut class="w-4 h-4" />
        <span v-if="!collapsed">{{ user?.firstName || 'Déconnexion' }}</span>
      </button>
    </div>

    <!-- Modal de confirmation suppression -->
    <ConfirmModal
      v-if="listToDelete !== null"
      message="Toutes les tâches associées seront supprimées. Confirmer ?"
      @confirm="confirmDelete"
      @cancel="listToDelete = null"
    />
  </aside>
</template>
