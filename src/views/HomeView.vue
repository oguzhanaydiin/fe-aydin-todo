<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
      <div class="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-2">
        <h1 class="text-3xl md:text-4xl font-bold text-text-main dark:text-dark-text-main mb-6">General</h1>
        
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
              <IconCheck class="h-4 w-4 text-transparent group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors" />
            </button>

            <div class="flex-1 min-w-0">
              <h3 class="text-base md:text-lg text-text-main dark:text-dark-text-main font-semibold mb-1 break-words">
                {{ todo.title }}
              </h3>
              <p v-if="todo.description" class="text-sm text-text-secondary dark:text-dark-text-secondary break-words">
                {{ todo.description }}
              </p>
              <div v-if="todo.category || todo.dueDate" class="flex gap-3 text-xs text-text-secondary dark:text-dark-text-secondary">
                <span v-if="todo.category" class="flex items-center gap-1">
                  <IconFolder class="h-3 w-3" />
                  {{ todo.category }}
                </span>
                <span v-if="todo.dueDate" class="flex items-center gap-1">
                  <IconCalendar class="h-3 w-3" />
                  {{ formatDate(todo.dueDate) }}
                </span>
              </div>
            </div>
            
            <div class="flex-shrink-0 flex gap-2">
              <button
                @click="openEditModal(todo)"
                class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
                title="Edit todo"
              >
                <IconEdit class="h-5 w-5" />
              </button>
              <button
                @click="confirmDelete(todo)"
                class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
                title="Delete todo"
              >
                <IconTrash class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Completed Todos -->
          <div v-if="completedTodos.length > 0" class="mt-6">
            <button
              @click="showCompleted = !showCompleted"
              class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary hover:text-text-main dark:hover:text-dark-text-main hover:border-primary dark:hover:border-dark-primary transition-colors mb-4 group"
            >
              <IconArrowDown 
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
                  <IconCheck class="h-4 w-4 text-white group-hover:text-transparent transition-colors" />
                </button>

                <div class="flex-1 min-w-0">
                  <h3 class="text-base md:text-lg text-text-main dark:text-dark-text-main font-semibold mb-1 line-through break-words">
                    {{ todo.title }}
                  </h3>
                  <p v-if="todo.description" class="text-sm text-text-secondary dark:text-dark-text-secondary line-through break-words">
                    {{ todo.description }}
                  </p>
                  <div v-if="todo.category || todo.dueDate" class="flex gap-3 text-xs text-text-secondary dark:text-dark-text-secondary">
                    <span v-if="todo.category" class="flex items-center gap-1">
                      <IconFolder class="h-3 w-3" />
                      {{ todo.category }}
                    </span>
                    <span v-if="todo.dueDate" class="flex items-center gap-1">
                      <IconCalendar class="h-3 w-3" />
                      {{ formatDate(todo.dueDate) }}
                    </span>
                  </div>
                </div>
                
                <div class="flex-shrink-0 flex gap-2">
                  <button
                    @click="confirmDelete(todo)"
                    class="p-2 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-background dark:hover:bg-dark-background"
                    title="Delete todo"
                  >
                    <IconTrash class="h-5 w-5" />
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
          <div class="flex flex-col gap-2 overflow-visible">
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
              
              <!-- Category Dropdown -->
              <div class="relative">
                <button
                  ref="categoryButton"
                  @click="showCategoryDropdown = !showCategoryDropdown"
                  :disabled="isAddingTodo"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors rounded-md border border-border dark:border-dark-border hover:border-primary dark:hover:border-dark-primary disabled:opacity-50"
                  title="Category"
                >
                  <IconFolder class="h-4 w-4" />
                  <span>{{ newTodoCategory || 'General' }}</span>
                </button>
                <div
                  v-if="showCategoryDropdown"
                  v-click-outside="() => showCategoryDropdown = false"
                  :style="categoryDropdownStyle"
                  class="fixed bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg shadow-lg py-1 z-50 min-w-[150px]"
                >
                  <button
                    @click="selectCategory('')"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-background dark:hover:bg-dark-background transition-colors"
                    :class="newTodoCategory === '' ? 'text-primary dark:text-dark-primary font-medium' : 'text-text-main dark:text-dark-text-main'"
                  >
                    General
                  </button>
                </div>
              </div>

              <!-- Due Date Picker -->
              <div class="relative">
                <button
                  ref="dateButton"
                  @click="showDatePicker = !showDatePicker"
                  :disabled="isAddingTodo"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors rounded-md border disabled:opacity-50"
                  :class="newTodoDueDate 
                    ? 'text-primary dark:text-dark-primary border-primary dark:border-dark-primary' 
                    : 'text-text-secondary dark:text-dark-text-secondary border-border dark:border-dark-border hover:text-primary dark:hover:text-dark-primary hover:border-primary dark:hover:border-dark-primary'"
                  title="Due date"
                >
                  <IconCalendar class="h-4 w-4" />
                  <span v-if="newTodoDueDate">{{ formatDate(newTodoDueDate) }}</span>
                  <span v-else>Date</span>
                </button>
                <div
                  v-if="showDatePicker"
                  v-click-outside="closeDatePicker"
                  :style="datePickerStyle"
                  class="fixed bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg shadow-lg p-3 z-50"
                >
                  <input
                    v-model="newTodoDueDate"
                    type="date"
                    class="bg-transparent text-sm text-text-main dark:text-dark-text-main border border-border dark:border-dark-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                  />
                  <div class="flex gap-2 mt-2">
                    <button
                      @click="clearDate"
                      class="flex-1 px-2 py-1 text-xs text-text-secondary dark:text-dark-text-secondary hover:text-text-main dark:hover:text-dark-text-main"
                    >
                      Clear
                    </button>
                    <button
                      @click="showDatePicker = false"
                      class="flex-1 px-2 py-1 text-xs bg-primary dark:bg-dark-primary text-white rounded"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
              
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { todosApi, type Todo } from '@/services/api'
import EditModal from '@/components/EditModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconFolder from '@/components/icons/IconFolder.vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'

// Click outside directive
interface HTMLElementWithClickOutside extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

const vClickOutside = {
  mounted(el: HTMLElementWithClickOutside, binding: { value: (event: Event) => void }) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElementWithClickOutside) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}

const allTodos = ref<Todo[]>([])
const showCompleted = ref(true)

const todos = computed(() => allTodos.value.filter(t => !t.completed))
const completedTodos = computed(() => allTodos.value.filter(t => t.completed))
const newTodoTitle = ref('')
const newTodoDescription = ref('')
const newTodoCategory = ref('')
const newTodoDueDate = ref('')
const showCategoryDropdown = ref(false)
const showDatePicker = ref(false)
const categoryButton = ref<HTMLElement>()
const dateButton = ref<HTMLElement>()

const categoryDropdownStyle = computed(() => {
  if (!categoryButton.value) return {}
  const rect = categoryButton.value.getBoundingClientRect()
  return {
    top: `${rect.top - 8}px`,
    right: `${window.innerWidth - rect.right}px`,
    transform: 'translateY(-100%)'
  }
})

const datePickerStyle = computed(() => {
  if (!dateButton.value) return {}
  const rect = dateButton.value.getBoundingClientRect()
  return {
    top: `${rect.top - 8}px`,
    right: `${window.innerWidth - rect.right}px`,
    transform: 'translateY(-100%)'
  }
})
const initialLoading = ref(false)
const isAddingTodo = ref(false)
const error = ref<string | null>(null)

// Edit todo
const isEditModalOpen = ref(false)
const todoToEdit = ref<Todo | null>(null)
const editTitle = ref('')
const editDescription = ref('')
const isEditing = ref(false)

// Delete todo
const isDeleteModalOpen = ref(false)
const todoToDelete = ref<Todo | null>(null)
const isDeleting = ref(false)

onMounted(async () => {
  try {
    initialLoading.value = true
    error.value = null
    allTodos.value = await todosApi.getTodos()
  } catch (err) {
    error.value = 'Failed to load todos'
    console.error('Error fetching todos:', err)
  } finally {
    initialLoading.value = false
  }
})

const addTodo = async () => {
  if (!newTodoTitle.value.trim()) return

  try {
    isAddingTodo.value = true
    error.value = null
    
    const newTodo = await todosApi.createTodo({
      title: newTodoTitle.value.trim(),
      description: newTodoDescription.value.trim(),
      category: newTodoCategory.value || undefined,
      dueDate: newTodoDueDate.value || undefined
    })
    allTodos.value.push(newTodo)
    
    newTodoTitle.value = ''
    newTodoDescription.value = ''
    newTodoCategory.value = ''
    newTodoDueDate.value = ''
  } catch (err) {
    error.value = 'Failed to create todo'
    console.error('Error creating todo:', err)
  } finally {
    isAddingTodo.value = false
  }
}

const selectCategory = (category: string) => {
  newTodoCategory.value = category
  showCategoryDropdown.value = false
}

const closeDatePicker = () => {
  newTodoDueDate.value = ''
  showDatePicker.value = false
}

const clearDate = () => {
  newTodoDueDate.value = ''
  showDatePicker.value = false
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const openEditModal = (todo: Todo) => {
  todoToEdit.value = todo
  editTitle.value = todo.title
  editDescription.value = todo.description
  isEditModalOpen.value = true
}

const cancelEdit = () => {
  isEditModalOpen.value = false
  todoToEdit.value = null
  editTitle.value = ''
  editDescription.value = ''
}

const toggleComplete = async (todo: Todo) => {
  try {
    error.value = null
    
    const updatedTodo = await todosApi.updateTodo(todo._id, {
      completed: !todo.completed
    })
    
    allTodos.value = allTodos.value.map(t => 
      t._id === todo._id ? updatedTodo : t
    )
  } catch (err) {
    error.value = 'Failed to update todo'
    console.error('Error updating todo:', err)
  }
}

const handleEdit = async (data: { title: string; description: string }) => {
  if (!todoToEdit.value) return

  const todoId = todoToEdit.value._id

  try {
    isEditing.value = true
    error.value = null
    
    const updatedTodo = await todosApi.updateTodo(todoId, {
      title: data.title,
      description: data.description
    })
    
    // Update the todos array
    allTodos.value = allTodos.value.map(t => 
      t._id === todoId ? updatedTodo : t
    )
    
    isEditModalOpen.value = false
    todoToEdit.value = null
    editTitle.value = ''
    editDescription.value = ''
  } catch (err) {
    error.value = 'Failed to update todo'
    console.error('Error updating todo:', err)
  } finally {
    isEditing.value = false
  }
}

const confirmDelete = (todo: Todo) => {
  todoToDelete.value = todo
  isDeleteModalOpen.value = true
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  todoToDelete.value = null
}

const handleDelete = async () => {
  if (!todoToDelete.value) return

  const todoId = todoToDelete.value._id

  try {
    isDeleting.value = true
    error.value = null
    
    await todosApi.deleteTodo(todoId)
    allTodos.value = allTodos.value.filter(t => t._id !== todoId)
    
    isDeleteModalOpen.value = false
    todoToDelete.value = null
  } catch (err) {
    error.value = 'Failed to delete todo'
    console.error('Error deleting todo:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>
