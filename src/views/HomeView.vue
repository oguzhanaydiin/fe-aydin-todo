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

        <!-- Empty -->
        <div 
          v-else-if="todos.length === 0"
          class="text-center py-12"
        >
          <p class="text-text-secondary dark:text-dark-text-secondary text-lg">
            No todos yet. Add one below to get started!
          </p>
        </div>

        <!-- List -->
        <div 
          v-for="todo in todos" 
          :key="todo._id"
          class="bg-surface dark:bg-dark-surface rounded-lg shadow-sm p-6 mb-4 border border-border dark:border-dark-border"
        >
          <h3 class="text-base md:text-lg text-text-main dark:text-dark-text-main font-semibold mb-1">
            {{ todo.title }}
          </h3>
          <p v-if="todo.description" class="text-sm text-text-secondary dark:text-dark-text-secondary">
            {{ todo.description }}
          </p>
        </div>
        
      </div>
    </div>

    <!-- Input -->
    <div class="bg-background dark:bg-dark-background overflow-y-auto [scrollbar-gutter:stable]">
      <div class="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
        <div class="bg-surface dark:bg-dark-surface rounded-lg shadow-sm p-6 border border-border dark:border-dark-border">
          <div class="flex flex-col gap-2">
            <input
              v-model="newTodoTitle"
              @keyup.enter="newTodoDescription ? addTodo() : null"
              type="text"
              placeholder="Title..."
              :disabled="isAddingTodo"
              class="bg-transparent text-base md:text-lg text-text-main dark:text-dark-text-main placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none disabled:opacity-50 font-semibold"
            />
            <div class="flex gap-2 items-center">
              <input
                v-model="newTodoDescription"
                @keyup.enter="addTodo"
                type="text"
                placeholder="Description (optional)..."
                :disabled="isAddingTodo"
                class="flex-1 bg-transparent text-xs md:text-sm text-text-main dark:text-dark-text-main placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none disabled:opacity-50"
              />
              <button
                @click="addTodo"
                :disabled="!newTodoTitle.trim() || isAddingTodo"
                class="px-5 py-2 bg-primary dark:bg-dark-primary text-white rounded-lg font-medium transition-opacity disabled:opacity-40 hover:enabled:opacity-90"
              >
                {{ isAddingTodo ? 'Adding...' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { todosApi, type Todo } from '@/services/api'

const todos = ref<Todo[]>([])
const newTodoTitle = ref('')
const newTodoDescription = ref('')
const initialLoading = ref(false)
const isAddingTodo = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    initialLoading.value = true
    error.value = null
    todos.value = await todosApi.getTodos()
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
    
    const newTodo = await todosApi.createTodo(
      newTodoTitle.value.trim(),
      newTodoDescription.value.trim()
    )
    todos.value.push(newTodo)
    
    newTodoTitle.value = ''
    newTodoDescription.value = ''
  } catch (err) {
    error.value = 'Failed to create todo'
    console.error('Error creating todo:', err)
  } finally {
    isAddingTodo.value = false
  }
}
</script>
