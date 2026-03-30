<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LeftSidebar from '../components/layout/LeftSidebar.vue';
import MainContent from '../components/layout/MainContent.vue';
import RightSidebar from '../components/layout/RightSidebar.vue';
import { useTaskLists } from '../composables/useTaskLists';

const sidebarCollapsed = ref(window.innerWidth < 768);

// Auto-collapse sur petit écran
const handleResize = () => {
  sidebarCollapsed.value = window.innerWidth < 768;
};
onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
const { lists } = useTaskLists();
const selectedListId = ref<number | null>(null);
const selectedTaskId = ref<number | null>(null);

const selectedListName = computed(() =>
  lists.value.find((l) => l.id === selectedListId.value)?.name || '',
);

const handleSelectList = (listId: number) => {
  selectedListId.value = listId;
  selectedTaskId.value = null;
};

const handleListDeleted = () => {
  selectedListId.value = null;
  selectedTaskId.value = null;
};

const handleTaskDeleted = () => {
  selectedTaskId.value = null;
};
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <LeftSidebar
      :collapsed="sidebarCollapsed"
      :selected-list-id="selectedListId"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @select-list="handleSelectList"
      @list-deleted="handleListDeleted"
    />

    <MainContent
      class="flex-1"
      :selected-list-id="selectedListId"
      :selected-task-id="selectedTaskId"
      :list-name="selectedListName"
      @select-task="selectedTaskId = $event"
    />

    <Transition name="slide">
      <RightSidebar
        v-if="selectedTaskId"
        :task-id="selectedTaskId"
        @close="selectedTaskId = null"
        @task-deleted="handleTaskDeleted"
      />
    </Transition>
  </div>
</template>
