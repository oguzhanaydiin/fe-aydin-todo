import { Module } from 'vuex'
import { RootState } from '../types'
import { todosApi, type Todo } from '@/services/api'

export interface TodosState {
  todos: Todo[]
  loading: boolean
  error: string | null
}

const todosModule: Module<TodosState, RootState> = {
  namespaced: true,
  state: {
    todos: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_TODOS(state, todos: Todo[]) {
      state.todos = todos
    },
    ADD_TODO(state, todo: Todo) {
      state.todos.push(todo)
    },
    UPDATE_TODO(state, updatedTodo: Todo) {
      const index = state.todos.findIndex(t => t._id === updatedTodo._id)
      if (index !== -1) {
        state.todos.splice(index, 1, updatedTodo)
      }
    },
    REMOVE_TODO(state, todoId: string) {
      state.todos = state.todos.filter(t => t._id !== todoId)
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    }
  },
  actions: {
    async fetchTodos({ commit }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const todos = await todosApi.getTodos()
        commit('SET_TODOS', todos)
      } catch (error) {
        console.error('Error fetching todos:', error)
        commit('SET_ERROR', 'Failed to load todos')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async addTodo({ commit }, todoData: { title: string; description?: string; listName?: string }) {
      try {
        commit('SET_ERROR', null)
        const newTodo = await todosApi.createTodo(todoData)
        commit('ADD_TODO', newTodo)
        return newTodo
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to create todo'
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      }
    },
    async updateTodo({ commit }, { id, updates }: { id: string; updates: any }) {
      try {
        commit('SET_ERROR', null)
        const updatedTodo = await todosApi.updateTodo(id, updates)
        commit('UPDATE_TODO', updatedTodo)
        return updatedTodo
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to update todo'
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      }
    },
    async deleteTodo({ commit }, todoId: string) {
      try {
        commit('SET_ERROR', null)
        await todosApi.deleteTodo(todoId)
        commit('REMOVE_TODO', todoId)
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to delete todo'
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      }
    }
  },
  getters: {
    all: (state) => state.todos,
    byListName: (state) => (listName: string) => {
      if (listName === 'General') {
        return state.todos.filter(t => !t.listName || t.listName === '' || t.listName === 'General')
      }
      return state.todos.filter(t => t.listName === listName)
    },
    count: (state) => (listName: string) => {
      if (listName === 'General') {
        return state.todos.filter(t => !t.listName || t.listName === '' || t.listName === 'General').length
      }
      return state.todos.filter(t => t.listName === listName).length
    },
    loading: (state) => state.loading,
    error: (state) => state.error
  }
}

export default todosModule
