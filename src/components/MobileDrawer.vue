
<template>
  <div v-if="isVisible">
    <!-- background shadow -->
    <div
    
    @click="close"
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    />

    <nav
    class="fixed top-0 left-0 h-full w-64 bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text-main border-r border-border dark:border-dark-border z-50 flex flex-col md:hidden transition-transform duration-300 ease-out"
    :class="isAnimating ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Header -->
      <div class="p-4 border-b border-border dark:border-dark-border flex items-center justify-between">
        <h1 class="text-xl font-bold flex items-center gap-0.5">
          <Icon icon="heroicons-outline:clipboard-document-list" class="w-6 h-6 text-emerald-700 dark:text-emerald-600" />
          AydinTodo
        </h1>
        <div class="flex items-center gap-2">
          <ColorModeToggle />
          <button
            @click="close"
            class="p-2 hover:bg-background dark:hover:bg-dark-background rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <Icon icon="heroicons-outline:x" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li>
            <router-link
            to="/"
            class="flex items-center justify-between px-4 py-2 rounded transition-colors group hover:bg-primary hover:text-white dark:hover:bg-dark-primary"
            active-class="!bg-primary !text-white dark:!bg-dark-primary"
            @click.native="close"
            exact
            >
              <div class="flex items-center gap-2">
                <span>General</span>
                <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-border dark:bg-dark-border">
                  {{ getTodoCount('General') }}
                </span>
              </div>
            </router-link>
          </li>
          <li v-for="listName in lists" :key="listName">
            <router-link
            :to="`/${listName.replace(/ /g, '_')}`"
            class="flex items-center justify-between px-4 py-2 rounded transition-colors group hover:bg-primary hover:text-white dark:hover:bg-dark-primary"
            active-class="!bg-primary !text-white dark:!bg-dark-primary"
            @click.native="close"
            >
              <div class="flex items-center gap-2">
                <span>{{ listName }}</span>
                <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-border dark:bg-dark-border">
                  {{ getTodoCount(listName) }}
                </span>
              </div>
              <button
                v-if="!listHasTodos(listName)"
                @click.stop.prevent="deleteList(listName)"
                class="p-1 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors rounded group-hover:text-white group-hover:hover:text-red-400"
                title="Delete list"
              >
                <Icon icon="heroicons-outline:trash" class="h-4 w-4" />
              </button>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Footer -->
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'
import ColorModeToggle from '@/components/ColorModeToggle.vue'

export default Vue.extend({
  name: 'MobileDrawer',
  components: {
    Icon,
    ColorModeToggle
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    allTodos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isVisible: false,
      isAnimating: false
    }
  },
  computed: {
    lists(): string[] {
      return this.$store.getters['lists/all']
    }
  },
  watch: {
    isOpen(newVal: boolean) {
      if (newVal) {
        this.isVisible = true
        setTimeout(() => {
          this.isAnimating = true
        }, 10)
      } else {
        this.isAnimating = false
        setTimeout(() => {
          this.isVisible = false
        }, 300)
      }
    }
  },
  methods: {
    getTodoCount(listName: string): number {
      const todos = this.allTodos as any[]
      if (listName === 'General') {
        return todos.filter(t => !t.listName || t.listName === '' || t.listName === 'General').length
      }
      return todos.filter(t => t.listName === listName).length
    },
    listHasTodos(listName: string): boolean {
      return (this.allTodos as any[]).some((todo: any) => todo.listName === listName)
    },
    deleteList(listName: string): void {
      this.$emit('delete-list', listName)
    },
    close(): void {
      this.$emit('close')
    },
    openNewListModal(): void {
      this.close()
      this.$emit('open-new-list')
    }
  }
})
</script>