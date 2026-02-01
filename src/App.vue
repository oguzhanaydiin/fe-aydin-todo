<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'
import ColorModeToggle from '@/components/ColorModeToggle.vue'
import MobileDrawer from '@/components/MobileDrawer.vue'
import NewListModal from '@/components/NewListModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default Vue.extend({
  name: 'App',
  components: {
    Icon,
    ColorModeToggle,
    MobileDrawer,
    NewListModal,
    ConfirmModal
  },
  data() {
    return {
      isMobileMenuOpen: false,
      isNewListModalOpen: false,
      isCreatingList: false,
      createError: null as string | null,
      isDeleteListModalOpen: false,
      listToDelete: null as string | null,
      isDeletingList: false
    }
  },
  computed: {
    lists(): string[] {
      return this.$store.getters['lists/all']
    },
    allTodos(): any[] {
      return this.$store.getters['todos/all']
    }
  },
  async mounted() {
    this.$store.dispatch('init')
  },
  methods: {
    listHasTodos(listName: string): boolean {
      return this.allTodos.some(todo => todo.listName === listName)
    },
    confirmDeleteList(listName: string) {
      this.listToDelete = listName
      this.isDeleteListModalOpen = true
    },
    cancelDeleteList() {
      this.isDeleteListModalOpen = false
      this.listToDelete = null
    },
    async handleDeleteList() {
      if (!this.listToDelete) return

      try {
        this.isDeletingList = true
        await this.$store.dispatch('lists/deleteList', this.listToDelete)
        
        // Navigate to General if we're currently on the deleted list
        const currentListName = this.$route.params.list ? this.$route.params.list.replace(/_/g, ' ') : null
        if (currentListName === this.listToDelete) {
          this.$router.push('/')
        }
        
        this.isDeleteListModalOpen = false
        this.listToDelete = null
      } catch (error: any) {
        console.error('Error deleting list:', error)
      } finally {
        this.isDeletingList = false
      }
    },
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
        this.$router.push(`/${listName.replace(/ /g, '_')}`)
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
      <h1 class="ml-3 text-lg font-bold text-text-main dark:text-dark-text-main flex items-center gap-0.5">
        <Icon icon="heroicons-outline:clipboard-document-list" class="w-5 h-5 text-emerald-700 dark:text-emerald-600" />
        AydinTodo
      </h1>
    </div>

    <!-- mobile navigation -->
    <MobileDrawer
      :is-open="isMobileMenuOpen"
      :all-todos="allTodos"
      @close="isMobileMenuOpen = false"
      @open-new-list="openNewListModal"
      @delete-list="confirmDeleteList"
    />

    <!-- desktop sidebar -->
    <nav class="hidden md:flex md:flex-col w-64 bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text-main border-r border-border dark:border-dark-border">
      <div class="p-4 border-b border-border dark:border-dark-border flex items-center justify-between">
        <h1 class="text-xl font-bold flex items-center gap-0.5">
          <Icon icon="heroicons-outline:clipboard-document-list" class="w-6 h-6 text-emerald-700 dark:text-emerald-600" />
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
                class="p-1 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors rounded group-hover:text-white group-hover:hover:text-red-400"
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

    <!-- Delete List Modal -->
    <ConfirmModal
      :is-open="isDeleteListModalOpen"
      title="Delete List"
      :message="`Are you sure you want to delete '${listToDelete}'?`"
      :loading="isDeletingList"
      loading-text="Deleting..."
      variant="danger"
      @confirm="handleDeleteList"
      @cancel="cancelDeleteList"
    />
  </div>
</template>
