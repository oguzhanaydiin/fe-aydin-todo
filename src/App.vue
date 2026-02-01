<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'
import ColorModeToggle from '@/components/ColorModeToggle.vue'
import MobileDrawer from '@/components/MobileDrawer.vue'
import NewListModal from '@/components/NewListModal.vue'

export default Vue.extend({
  name: 'App',
  components: {
    Icon,
    ColorModeToggle,
    MobileDrawer,
    NewListModal
  },
  data() {
    return {
      isMobileMenuOpen: false,
      isNewListModalOpen: false,
      isCreatingList: false,
      createError: null as string | null
    }
  },
  computed: {
    lists(): string[] {
      return this.$store.getters['lists/all']
    }
  },
  mounted() {
    this.$store.dispatch('init')
  },
  methods: {
    openNewListModal() {
      this.isNewListModalOpen = true
      this.createError = null
    },
    async handleNewList(listName: string) {
      try {
        this.isCreatingList = true
        this.createError = null
        await this.$store.dispatch('lists/addList', listName)
        this.isNewListModalOpen = false
        // Navigate to the new list
        this.$router.push(`/${encodeURIComponent(listName)}`)
      } catch (error: any) {
        this.createError = error.message || 'Failed to create list'
        // Don't close the modal so user can see the error
      } finally {
        this.isCreatingList = false
      }
    },
    cancelNewList() {
      this.isNewListModalOpen = false
      this.createError = null
    }
  }
})
</script>

<template>
  <div class="flex h-full">
    <!-- mobile header -->
    <div class="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border z-30 flex items-center px-4">
      <button
        @click="isMobileMenuOpen = true"
        class="p-2 hover:bg-background dark:hover:bg-dark-background rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Icon icon="heroicons-outline:menu" class="w-6 h-6 text-text-main dark:text-dark-text-main" />
      </button>
      <h1 class="ml-3 text-lg font-bold text-text-main dark:text-dark-text-main">AydinTodo</h1>
    </div>

    <!-- mobile navigation -->
    <MobileDrawer
      :is-open="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
      @open-new-list="openNewListModal"
    />

    <!-- desktop sidebar -->
    <nav class="hidden md:flex md:flex-col w-64 bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text-main border-r border-border dark:border-dark-border">
      <div class="p-4 border-b border-border dark:border-dark-border flex items-center justify-between">
        <h1 class="text-xl font-bold">AydinTodo</h1>
        <ColorModeToggle />
      </div>
      
      <div class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li>
            <router-link 
              to="/"
              class="block px-4 py-2 rounded hover:bg-primary hover:text-white dark:hover:bg-dark-primary transition-colors"
              active-class="bg-primary text-white dark:bg-dark-primary"
              exact
            >
              General
            </router-link>
          </li>
          <li v-for="list in lists" :key="list">
            <router-link 
              :to="`/${encodeURIComponent(list)}`"
              class="block px-4 py-2 rounded hover:bg-primary hover:text-white dark:hover:bg-dark-primary transition-colors"
              active-class="bg-primary text-white dark:bg-dark-primary"
            >
              {{ list }}
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

    <!-- Main content -->
    <main class="flex-1 overflow-hidden pt-14 md:pt-0">
      <router-view />
    </main>

    <!-- New List Modal -->
    <NewListModal
      :is-open="isNewListModalOpen"
      :loading="isCreatingList"
      :external-error="createError"
      @save="handleNewList"
      @cancel="cancelNewList"
    />
  </div>
</template>
