<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import LeftSidebar from '../components/layout/LeftSidebar.vue';
import MainContent from '../components/layout/MainContent.vue';
import RightSidebar from '../components/layout/RightSidebar.vue';

const { user } = useAuth();

const sidebarCollapsed = ref(false);
const selectedListId = ref<number | null>(null);
const selectedTaskId = ref<number | null>(null);

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
  <div class="flex h-screen bg-gray-50">
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
      @select-task="selectedTaskId = $event"
    />

    <RightSidebar
      v-if="selectedTaskId"
      :task-id="selectedTaskId"
      @close="selectedTaskId = null"
      @task-deleted="handleTaskDeleted"
    />
  </div>
</template>
