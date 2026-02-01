<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'
import { type Todo } from '@/services/api'

export default Vue.extend({
  name: 'TodoItem',
  components: {
    Icon
  },
  props: {
    todo: {
      type: Object as () => Todo,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    showEditButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleToggleComplete() {
      this.$emit('toggle-complete', this.todo)
    },
    handleEdit() {
      this.$emit('edit', this.todo)
    },
    handleDelete() {
      this.$emit('delete', this.todo)
    }
  }
})
</script>

<template>
  <div 
    class="bg-surface dark:bg-dark-surface rounded-lg shadow-sm px-6 py-3 mb-4 border border-border dark:border-dark-border flex items-center gap-4"
    :class="{ 'opacity-50 hover:opacity-70 transition-opacity': isCompleted }"
  >
    <button
      @click="handleToggleComplete"
      class="flex-shrink-0 w-6 h-6 rounded border-2 transition-all shadow-sm flex items-center justify-center group"
      :class="isCompleted 
        ? 'border-green-500 dark:border-green-400 bg-green-500 dark:bg-green-400 hover:border-border dark:hover:border-dark-border hover:bg-transparent' 
        : 'border-border dark:border-dark-border hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow'"
      :title="isCompleted ? 'Mark as incomplete' : 'Mark as complete'"
    >
      <Icon 
        icon="heroicons-outline:check" 
        class="h-4 w-4 transition-colors"
        :class="isCompleted 
          ? 'text-white group-hover:text-transparent' 
          : 'text-transparent group-hover:text-green-500 dark:group-hover:text-green-400'"
      />
    </button>

    <div class="flex-1 min-w-0">
      <h3 
        class="text-base md:text-lg text-text-main dark:text-dark-text-main font-semibold mb-1 break-words"
        :class="{ 'line-through': isCompleted }"
      >
        {{ todo.title }}
      </h3>
      <p 
        v-if="todo.description" 
        class="text-sm text-text-secondary dark:text-dark-text-secondary break-words"
        :class="{ 'line-through': isCompleted }"
      >
        {{ todo.description }}
      </p>
    </div>
    
    <div class="flex-shrink-0 flex gap-2 items-center">
      <span 
        v-if="todo.listName" 
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background dark:bg-dark-background text-sm text-text-secondary dark:text-dark-text-secondary font-medium"
        :class="{ 'line-through': isCompleted }"
      >
        <Icon icon="heroicons-outline:folder" class="h-4 w-4" />
        {{ todo.listName }}
      </span>
      <button
        v-if="showEditButton && !isCompleted"
        @click="handleEdit"
        class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
        title="Edit todo"
      >
        <Icon icon="heroicons-outline:pencil" class="h-5 w-5" />
      </button>
      <button
        @click="handleDelete"
        class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
        title="Delete todo"
      >
        <Icon icon="heroicons-outline:trash" class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
