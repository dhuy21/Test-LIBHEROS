<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Menu, Plus, Trash2, LogOut, ChevronLeft, FolderOpen } from 'lucide-vue-next';
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

const { lists, loading, error, fetchLists, createList, updateList, deleteList } = useTaskLists();
const { user, logout } = useAuth();

const showCreateInput = ref(false);
const newListName = ref('');
const listToDelete = ref<number | null>(null);
const editingListId = ref<number | null>(null);
const editingName = ref('');

onMounted(fetchLists);

watch(() => props.collapsed, (isCollapsed) => {
  if (isCollapsed) {
    showCreateInput.value = false;
    editingListId.value = null;
  }
});

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

const startRename = (id: number, name: string) => {
  editingListId.value = id;
  editingName.value = name;
};

const saveRename = async () => {
  if (!editingListId.value || !editingName.value.trim()) return;
  await updateList(editingListId.value, editingName.value.trim());
  editingListId.value = null;
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
    <div :class="['flex p-3 border-b border-gray-200', collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between']">
      <button @click="emit('toggle')" class="p-2 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform">
        <ChevronLeft v-if="!collapsed" class="w-5 h-5 text-gray-600" />
        <Menu v-else class="w-5 h-5 text-gray-600" />
      </button>
      <button
        @click="handleCreateButton"
        class="p-2 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
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
          class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autofocus
        />
        <button type="submit" class="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 active:scale-95 transition-all">
          OK
        </button>
      </form>
      <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
    </div>

    <!-- Listes -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading && !collapsed" class="flex items-center justify-center py-8">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="lists.length === 0 && !collapsed" class="flex flex-col items-center text-gray-400 py-8">
        <FolderOpen class="w-8 h-8 mb-2" />
        <p class="text-sm">Aucune liste</p>
      </div>
      <div
        v-for="list in lists"
        :key="list.id"
        role="button"
        tabindex="0"
        @click="emit('select-list', list.id)"
        @dblclick.stop="!collapsed && startRename(list.id, list.name)"
        @keydown.enter="emit('select-list', list.id)"
        :class="[
          'flex items-center py-2 cursor-pointer group transition-colors duration-150',
          collapsed ? 'justify-center px-2' : 'gap-2 px-3',
          selectedListId === list.id
            ? 'bg-blue-50 border-l-2 border-blue-500'
            : 'hover:bg-gray-50 border-l-2 border-transparent'
        ]"
      >
        <!-- Collapsed : initiale du nom -->
        <span
          v-if="collapsed"
          class="w-8 h-8 flex items-center justify-center text-xs font-medium rounded"
          :class="selectedListId === list.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'"
          :title="list.name"
        >
          {{ list.name.charAt(0).toUpperCase() }}
        </span>
        <!-- Mode rename -->
        <form
          v-else-if="editingListId === list.id"
          @submit.prevent="saveRename"
          @click.stop
          class="flex-1"
        >
          <input
            v-model="editingName"
            type="text"
            class="w-full px-2 py-0.5 text-sm border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autofocus
            @blur="saveRename"
            @keyup.escape="editingListId = null"
          />
        </form>
        <!-- Mode normal -->
        <span v-else class="flex-1 text-sm text-gray-800 truncate">{{ list.name }}</span>
        <button
          v-if="!collapsed && editingListId !== list.id"
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
