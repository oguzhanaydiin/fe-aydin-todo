<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
      <div class="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-2">
        <h1 class="text-3xl md:text-4xl font-bold text-text-main dark:text-dark-text-main mb-6">{{ currentListName || 'General' }}</h1>
        
        <div 
          v-if="initialLoading"
          class="text-center py-12"
        >
          <p class="text-text-secondary dark:text-dark-text-secondary text-lg">
            Loading todos...
          </p>
        </div>

        <div 
          v-else-if="error"
          class="text-center py-12"
        >
          <p class="text-red-500 text-lg">
            {{ error }}
          </p>
        </div>

        <div 
          v-else-if="allTodos.length === 0"
          class="text-center py-12"
        >
          <p class="text-text-secondary dark:text-dark-text-secondary text-lg">
            No todos yet. Add one below to get started!
          </p>
        </div>

        <template v-else>
          <!-- No Todos Message -->
          <div 
            v-if="todos.length === 0 && completedTodos.length > 0"
            class="text-center py-12"
          >
            <p class="text-text-secondary dark:text-dark-text-secondary text-lg">
              No todos yet. Add one below to get started!
            </p>
          </div>

          <!-- Todos -->
          <div 
            v-for="todo in todos" 
            :key="todo._id"
            class="bg-surface dark:bg-dark-surface rounded-lg shadow-sm px-6 py-3 mb-4 border border-border dark:border-dark-border flex items-center gap-4"
          >
            <button
              @click="toggleComplete(todo)"
              class="flex-shrink-0 w-6 h-6 rounded border-2 border-border dark:border-dark-border hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all shadow-sm hover:shadow flex items-center justify-center group"
              title="Mark as complete"
            >
              <Icon icon="heroicons-outline:check" class="h-4 w-4 text-transparent group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors" />
            </button>

            <div class="flex-1 min-w-0">
              <h3 class="text-base md:text-lg text-text-main dark:text-dark-text-main font-semibold mb-1 break-words">
                {{ todo.title }}
              </h3>
              <p v-if="todo.description" class="text-sm text-text-secondary dark:text-dark-text-secondary break-words">
                {{ todo.description }}
              </p>
            </div>
            
            <div class="flex-shrink-0 flex gap-2 items-center">
              <span v-if="todo.listName" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background dark:bg-dark-background text-sm text-text-secondary dark:text-dark-text-secondary font-medium">
                <Icon icon="heroicons-outline:folder" class="h-4 w-4" />
                {{ todo.listName }}
              </span>
              <button
                @click="openEditModal(todo)"
                class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
                title="Edit todo"
              >
                <Icon icon="heroicons-outline:pencil" class="h-5 w-5" />
              </button>
              <button
                @click="confirmDelete(todo)"
                class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
                title="Delete todo"
              >
                <Icon icon="heroicons-outline:trash" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Completed Todos -->
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
              <div 
                v-for="todo in completedTodos" 
                :key="todo._id"
                class="bg-surface dark:bg-dark-surface rounded-lg shadow-sm px-6 py-3 mb-4 border border-border dark:border-dark-border flex items-center gap-4 opacity-50 hover:opacity-70 transition-opacity"
              >
                <button
                  @click="toggleComplete(todo)"
                  class="flex-shrink-0 w-6 h-6 rounded border-2 border-green-500 dark:border-green-400 bg-green-500 dark:bg-green-400 hover:border-border dark:hover:border-dark-border hover:bg-transparent transition-all shadow-sm flex items-center justify-center group"
                  title="Mark as incomplete"
                >
                  <Icon icon="heroicons-outline:check" class="h-4 w-4 text-white group-hover:text-transparent transition-colors" />
                </button>

                <div class="flex-1 min-w-0">
                  <h3 class="text-base md:text-lg text-text-main dark:text-dark-text-main font-semibold mb-1 line-through break-words">
                    {{ todo.title }}
                  </h3>
                  <p v-if="todo.description" class="text-sm text-text-secondary dark:text-dark-text-secondary line-through break-words">
                    {{ todo.description }}
                  </p>
                </div>
                
                <div class="flex-shrink-0 flex gap-2 items-center">
                  <span v-if="todo.listName" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background dark:bg-dark-background text-sm text-text-secondary dark:text-dark-text-secondary font-medium line-through">
                    <Icon icon="heroicons-outline:folder" class="h-4 w-4" />
                    {{ todo.listName }}
                  </span>
                  <button
                    @click="confirmDelete(todo)"
                    class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
                    title="Delete todo"
                  >
                    <Icon icon="heroicons-outline:trash" class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        
      </div>
    </div>

    <!-- Input -->
    <div class="bg-background dark:bg-dark-background overflow-y-auto [scrollbar-gutter:stable]">
      <div class="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
        <div class="bg-surface dark:bg-dark-surface rounded-lg shadow-sm p-6 border border-border dark:border-dark-border relative">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <input
                v-model="newTodoTitle"
                @keyup.enter="newTodoDescription ? addTodo() : null"
                type="text"
                placeholder="Title..."
                maxlength="100"
                :disabled="isAddingTodo"
                class="flex-1 bg-transparent text-base md:text-lg text-text-main dark:text-dark-text-main placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none disabled:opacity-50 font-semibold"
              />
              <span 
                v-if="newTodoTitle.length === 100"
                class="text-xs text-red-500 dark:text-red-400 font-medium flex-shrink-0"
              >
                100/100
              </span>
            </div>
            <div class="flex gap-2 items-center">
              <input
                v-model="newTodoDescription"
                @keyup.enter="addTodo"
                type="text"
                placeholder="Description (optional)..."
                maxlength="100"
                :disabled="isAddingTodo"
                class="flex-1 bg-transparent text-xs md:text-sm text-text-main dark:text-dark-text-main placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none disabled:opacity-50"
              />
              <span 
                v-if="newTodoDescription.length === 100"
                class="text-xs text-red-500 dark:text-red-400 font-medium flex-shrink-0"
              >
                100/100
              </span>
              
              <!-- List Dropdown -->
              <ListDropdown
                v-model="selectedListName"
                :disabled="isAddingTodo"
              />
              
              <button
                @click="addTodo"
                :disabled="!newTodoTitle.trim() || isAddingTodo"
                class="px-4 py-1.5 bg-primary dark:bg-dark-primary text-white rounded-md text-sm font-medium transition-opacity disabled:opacity-40 hover:enabled:opacity-90"
              >
                {{ isAddingTodo ? 'Adding...' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditModal
      :is-open="isEditModalOpen"
      :title="editTitle"
      :description="editDescription"
      :loading="isEditing"
      @save="handleEdit"
      @cancel="cancelEdit"
    />

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
import { todosApi, type Todo } from '@/services/api'
import EditModal from '@/components/EditModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ListDropdown from '@/components/ListDropdown.vue'

export default Vue.extend({
  name: 'Home',
  components: {
    Icon,
    EditModal,
    ConfirmModal,
    ListDropdown
  },
  data() {
    return {
      allTodos: [] as Todo[],
      showCompleted: true,
      newTodoTitle: '',
      newTodoDescription: '',
      selectedListName: 'General',
      initialLoading: false,
      isAddingTodo: false,
      error: null as string | null,
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
    await this.fetchTodos()
    // Set the dropdown to match the current list on initial load
    this.selectedListName = this.currentListName || 'General'
  },
  watch: {
    '$route'() {
      // When route changes, update the dropdown to match current list
      this.selectedListName = this.currentListName || 'General'
    }
  },
  methods: {
    async fetchTodos() {
      try {
        this.initialLoading = true
        this.error = null
        this.allTodos = await todosApi.getTodos()
      } catch (err) {
        this.error = 'Failed to load todos'
        console.error('Error fetching todos:', err)
      } finally {
        this.initialLoading = false
      }
    },
    async addTodo() {
      if (!this.newTodoTitle.trim()) return

      try {
        this.isAddingTodo = true
        this.error = null

        const listName = this.selectedListName || 'General'
        
        const newTodo = await todosApi.createTodo({
          title: this.newTodoTitle.trim(),
          description: this.newTodoDescription.trim(),
          listName: listName
        })
        this.allTodos.push(newTodo)
        
        this.newTodoTitle = ''
        this.newTodoDescription = ''
        
        // Navigate to the list if it's different from the current one
        const currentListOrGeneral = this.currentListName || 'General'
        if (listName !== currentListOrGeneral) {
          if (listName === 'General') {
            this.$router.push('/')
          } else {
            this.$router.push(`/${listName.replace(/ /g, '_')}`)
          }
        } else {
          this.selectedListName = this.currentListName || 'General'
        }
      } catch (err) {
        this.error = 'Failed to create todo'
        console.error('Error creating todo:', err)
      } finally {
        this.isAddingTodo = false
      }
    },
    openEditModal(todo: Todo) {
      this.todoToEdit = todo
      this.editTitle = todo.title
      this.editDescription = todo.description
      this.isEditModalOpen = true
    },
    cancelEdit() {
      this.isEditModalOpen = false
      this.todoToEdit = null
      this.editTitle = ''
      this.editDescription = ''
    },
    async toggleComplete(todo: Todo) {
      try {
        this.error = null
        
        const updatedTodo = await todosApi.updateTodo(todo._id, {
          completed: !todo.completed
        })
        
        this.allTodos = this.allTodos.map(t => 
          t._id === todo._id ? updatedTodo : t
        )
      } catch (err) {
        this.error = 'Failed to update todo'
        console.error('Error updating todo:', err)
      }
    },
    async handleEdit(data: { title: string; description: string }) {
      if (!this.todoToEdit) return

      const todoId = this.todoToEdit._id

      try {
        this.isEditing = true
        this.error = null
        
        const updatedTodo = await todosApi.updateTodo(todoId, {
          title: data.title,
          description: data.description
        })
        
        // Update the todos array
        this.allTodos = this.allTodos.map(t => 
          t._id === todoId ? updatedTodo : t
        )
        
        this.isEditModalOpen = false
        this.todoToEdit = null
        this.editTitle = ''
        this.editDescription = ''
      } catch (err) {
        this.error = 'Failed to update todo'
        console.error('Error updating todo:', err)
      } finally {
        this.isEditing = false
      }
    },
    confirmDelete(todo: Todo) {
      this.todoToDelete = todo
      this.isDeleteModalOpen = true
    },
    cancelDelete() {
      this.isDeleteModalOpen = false
      this.todoToDelete = null
    },
    async handleDelete() {
      if (!this.todoToDelete) return

      const todoId = this.todoToDelete._id

      try {
        this.isDeleting = true
        this.error = null
        
        await todosApi.deleteTodo(todoId)
        this.allTodos = this.allTodos.filter(t => t._id !== todoId)
        
        this.isDeleteModalOpen = false
        this.todoToDelete = null
      } catch (err) {
        this.error = 'Failed to delete todo'
        console.error('Error deleting todo:', err)
      } finally {
        this.isDeleting = false
      }
    }
  }
})
</script>
