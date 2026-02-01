<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
      <div class="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-2">
        <h1 class="text-3xl md:text-4xl font-bold text-text-main dark:text-dark-text-main mb-6">{{ currentListName || 'General' }}</h1>
        
        <!-- loading -->
        <EmptyState 
          v-if="initialLoading"
          type="loading"
          message="Loading todos..."
        />

        <!-- error -->
        <EmptyState 
          v-else-if="error"
          type="error"
          :message="error"
        />

        <!-- empty -->
        <EmptyState 
          v-else-if="allTodos.length === 0"
          type="empty"
          message="No todos yet. Add one below to get started!"
        />

        <template v-else>
          <EmptyState 
            v-if="todos.length === 0 && completedTodos.length > 0"
            type="empty"
            message="No todos yet. Add one below to get started!"
          />

          <TodoItem
            v-for="todo in todos"
            :key="todo._id"
            :todo="todo"
            :is-completed="false"
            @toggle-complete="toggleComplete"
            @edit="openEditModal"
            @delete="confirmDelete"
          />

          <!-- completed todos -->
          <div v-if="completedTodos.length > 0" class="mt-6">
            <button
              @click="showCompleted = !showCompleted"
              class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary hover:text-text-main dark:hover:text-dark-text-main hover:border-primary dark:hover:border-dark-primary transition-colors mb-4 group"
            >
              <Icon 
                icon="heroicons-outline:chevron-down" 
                class="h-4 w-4 transition-transform duration-200"
                :class="{ 'rotate-180': !showCompleted }"
              />
              <span class="text-sm font-medium">
                Completed ({{ completedTodos.length }})
              </span>
            </button>

            <div v-show="showCompleted">
              <TodoItem
                v-for="todo in completedTodos"
                :key="todo._id"
                :todo="todo"
                :is-completed="true"
                :show-edit-button="false"
                @toggle-complete="toggleComplete"
                @delete="confirmDelete"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Todo Input -->
    <TodoInput
      :initial-list-name="currentListName || 'General'"
      @add-todo="handleAddTodo"
    />

    <!-- Edit Modal -->
    <EditModal
      :is-open="isEditModalOpen"
      :title="editTitle"
      :description="editDescription"
      :loading="isEditing"
      @save="handleEdit"
      @cancel="cancelEdit"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Todo"
      message="Are you sure you want to delete this todo?"
      :loading="isDeleting"
      loading-text="Deleting..."
      variant="danger"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'
import { type Todo } from '@/services/api'
import TodoItem from '@/components/todos/TodoItem.vue'
import TodoInput from '@/components/todos/TodoInput.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import EditModal from '@/components/modals/EditModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { toast } from '@/services/toast'

export default Vue.extend({
  name: 'Home',
  components: {
    Icon,
    TodoItem,
    TodoInput,
    EmptyState,
    EditModal,
    ConfirmModal
  },
  data() {
    return {
      showCompleted: true,
      isEditModalOpen: false,
      todoToEdit: null as Todo | null,
      editTitle: '',
      editDescription: '',
      isEditing: false,
      isDeleteModalOpen: false,
      todoToDelete: null as Todo | null,
      isDeleting: false
    }
  },
  computed: {
    currentListName(): string | null {
      return this.$route.params.list ? this.$route.params.list.replace(/_/g, ' ') : null
    },
    allTodos(): Todo[] {
      return this.$store.getters['todos/all']
    },
    initialLoading(): boolean {
      return this.$store.getters['todos/loading']
    },
    error(): string | null {
      return this.$store.getters['todos/error']
    },
    filteredTodos(): Todo[] {
      const listName = this.currentListName
      if (listName) {
        return this.allTodos.filter(t => t.listName === listName)
      }
      // For General (/ route)
      return this.allTodos.filter(t => !t.listName || t.listName === '' || t.listName === 'General')
    },
    todos(): Todo[] {
      return this.filteredTodos.filter(t => !t.completed)
    },
    completedTodos(): Todo[] {
      return this.filteredTodos.filter(t => t.completed)
    }
  },
  async mounted() {
    this.updatePageTitle()
  },
  watch: {
    '$route'() {
      this.updatePageTitle()
    }
  },
  methods: {
    updatePageTitle() {
      const listName = this.currentListName
      document.title = listName ? `${listName} - AydinTodo` : 'AydinTodo'
    },
    navigateToList(listName: string) {
      if (listName === 'General') {
        this.$router.push('/')
      } else {
        this.$router.push(`/${listName.replace(/ /g, '_')}`)
      }
    },

    async handleAddTodo(data: { title: string; description: string; listName: string }) {
      try {
        await this.$store.dispatch('todos/addTodo', {
          title: data.title,
          description: data.description,
          listName: data.listName
        })
        
        // Navigate to the list if it's different from the current one
        const currentListOrGeneral = this.currentListName || 'General'
        if (data.listName !== currentListOrGeneral) {
          this.navigateToList(data.listName)
        }
      } catch (err) {
        console.error('Error creating todo:', err)
      }
    },
    async toggleComplete(todo: Todo) {
      try {
        await this.$store.dispatch('todos/updateTodo', {
          id: todo._id,
          updates: { completed: !todo.completed }
        })
      } catch (err) {
        console.error('Error updating todo:', err)
      }
    },

    openEditModal(todo: Todo) {
      this.todoToEdit = todo
      this.editTitle = todo.title
      this.editDescription = todo.description
      this.isEditModalOpen = true
    },
    async handleEdit(data: { title: string; description: string }) {
      if (!this.todoToEdit) return

      try {
        this.isEditing = true
        
        await this.$store.dispatch('todos/updateTodo', {
          id: this.todoToEdit._id,
          updates: {
            title: data.title,
            description: data.description
          }
        })
        
        toast.success('Todo updated')
        this.cancelEdit()
      } catch (err) {
        console.error('Error updating todo:', err)
      } finally {
        this.isEditing = false
      }
    },
    cancelEdit() {
      this.isEditModalOpen = false
      this.todoToEdit = null
      this.editTitle = ''
      this.editDescription = ''
    },

    confirmDelete(todo: Todo) {
      this.todoToDelete = todo
      this.isDeleteModalOpen = true
    },
    async handleDelete() {
      if (!this.todoToDelete) return

      try {
        this.isDeleting = true
        await this.$store.dispatch('todos/deleteTodo', this.todoToDelete._id)
        toast.success('Todo deleted')
        this.cancelDelete()
      } catch (err) {
        console.error('Error deleting todo:', err)
      } finally {
        this.isDeleting = false
      }
    },
    cancelDelete() {
      this.isDeleteModalOpen = false
      this.todoToDelete = null
    }
  }
})
</script>
