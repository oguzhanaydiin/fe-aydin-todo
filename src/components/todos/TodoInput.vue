<script lang="ts">
import Vue from 'vue'
import ListDropdown from '@/components/todos/ListDropdown.vue'

export default Vue.extend({
  name: 'TodoInput',
  components: {
    ListDropdown
  },
  props: {
    initialListName: {
      type: String,
      default: 'General'
    }
  },
  data() {
    return {
      title: '',
      description: '',
      selectedListName: this.initialListName,
      isAdding: false
    }
  },
  watch: {
    initialListName(newVal: string) {
      this.selectedListName = newVal
    }
  },
  methods: {
    async handleAdd() {
      if (!this.title.trim()) return

      try {
        this.isAdding = true
        
        this.$emit('add-todo', {
          title: this.title.trim(),
          description: this.description.trim(),
          listName: this.selectedListName || 'General'
        })
        
        // Clear inputs after successful add
        this.title = ''
        this.description = ''
      } catch (err) {
        console.error('Error in TodoInput:', err)
      } finally {
        this.isAdding = false
      }
    }
  }
})
</script>

<template>
  <div class="bg-background dark:bg-dark-background overflow-y-auto [scrollbar-gutter:stable]">
    <div class="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
      <div class="bg-surface dark:bg-dark-surface rounded-lg shadow-sm p-6 border border-border dark:border-dark-border relative">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input
              v-model="title"
              @keyup.enter="description ? handleAdd() : null"
              type="text"
              placeholder="Title..."
              maxlength="100"
              :disabled="isAdding"
              class="flex-1 bg-transparent text-base md:text-lg text-text-main dark:text-dark-text-main placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none disabled:opacity-50 font-semibold"
            />
            <span 
              v-if="title.length === 100"
              class="text-xs text-error font-medium flex-shrink-0"
            >
              100/100
            </span>
          </div>
          <div class="flex gap-2 items-center">
            <input
              v-model="description"
              @keyup.enter="handleAdd"
              type="text"
              placeholder="Description (optional)..."
              maxlength="100"
              :disabled="isAdding"
              class="flex-1 bg-transparent text-xs md:text-sm text-text-main dark:text-dark-text-main placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none disabled:opacity-50"
            />
            <span 
              v-if="description.length === 100"
              class="text-xs text-error font-medium flex-shrink-0"
            >
              100/100
            </span>
            
            <!-- List Dropdown -->
            <ListDropdown
              v-model="selectedListName"
              :disabled="isAdding"
            />
            
            <button
              @click="handleAdd"
              :disabled="!title.trim() || isAdding"
              class="px-4 py-1.5 bg-primary dark:bg-dark-primary text-white rounded-md text-sm font-medium transition-opacity disabled:opacity-40 hover:enabled:opacity-90"
            >
              {{ isAdding ? 'Adding...' : 'Add' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
