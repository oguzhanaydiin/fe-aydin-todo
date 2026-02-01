<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'
import ColorModeToggle from '@/components/ui/ColorModeToggle.vue'

export default Vue.extend({
  name: 'DesktopNavbar',
  components: {
    Icon,
    ColorModeToggle
  },
  props: {
    lists: {
      type: Array as () => string[],
      required: true
    },
    allTodos: {
      type: Array as () => any[],
      required: true
    }
  },
  methods: {
    listHasTodos(listName: string): boolean {
      return this.allTodos.some(todo => todo.listName === listName)
    },
    openNewListModal() {
      this.$emit('open-new-list')
    },
    confirmDeleteList(listName: string) {
      this.$emit('delete-list', listName)
    }
  }
})
</script>

<template>
  <nav class="hidden md:flex md:flex-col w-64 bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text-main border-r border-border dark:border-dark-border">
    <div class="p-4 border-b border-border dark:border-dark-border flex items-center justify-between">
      <h1 class="text-xl font-bold flex items-center gap-0.5">
        <Icon icon="heroicons-outline:clipboard-document-list" class="w-6 h-6 text-logo" />
        AydinTodo
      </h1>
      <ColorModeToggle />
    </div>
    
    <div class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-2">
        <li>
          <router-link 
            to="/"
            class="flex items-center justify-between px-4 py-2 rounded transition-colors group hover:bg-primary hover:text-white dark:hover:bg-dark-primary"
            active-class="!bg-primary !text-white dark:!bg-dark-primary"
            exact
          >
            <div class="flex items-center gap-2">
              <span>General</span>
              <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-border dark:bg-dark-border">
                {{ allTodos.filter(t => !t.listName || t.listName === '' || t.listName === 'General').length }}
              </span>
            </div>
          </router-link>
        </li>
        <li v-for="listName in lists" :key="listName">
          <router-link 
            :to="`/${listName.replace(/ /g, '_')}`"
            class="flex items-center justify-between px-4 py-2 rounded transition-colors group hover:bg-primary hover:text-white dark:hover:bg-dark-primary"
            active-class="!bg-primary !text-white dark:!bg-dark-primary"
          >
            <div class="flex items-center gap-2">
              <span>{{ listName }}</span>
              <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-border dark:bg-dark-border">
                {{ allTodos.filter(t => t.listName === listName).length }}
              </span>
            </div>
            <button
              v-if="!listHasTodos(listName)"
              @click.stop.prevent="confirmDeleteList(listName)"
              class="p-1 text-text-secondary dark:text-dark-text-secondary hover:text-error transition-colors rounded group-hover:text-white group-hover:hover:text-error"
              title="Delete list"
            >
              <Icon icon="heroicons-outline:trash" class="h-4 w-4" />
            </button>
          </router-link>
        </li>
      </ul>
    </div>
    
    <div class="p-4 border-t border-border dark:border-dark-border">
      <button
        @click="openNewListModal"
        class="w-full px-4 py-2 rounded border-2 border-dashed border-border dark:border-dark-border hover:border-primary dark:hover:border-dark-primary hover:bg-background dark:hover:bg-dark-background transition-colors flex items-center justify-center gap-2 text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary"
      >
        <Icon icon="heroicons-outline:plus" class="h-4 w-4" />
        <span class="text-sm font-medium">New List</span>
      </button>
    </div>
  </nav>
</template>
