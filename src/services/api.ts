import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_AYDIN_TODO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Todo {
  _id: string
  title: string
  description: string
  completed: boolean
  deleted: boolean
  category?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodo {
  title: string
  description?: string
  category?: string
  dueDate?: string
}

export interface UpdateTodo {
  title?: string
  description?: string
  completed?: boolean
  category?: string
  dueDate?: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const todosApi = {
  // Get all todos
  getTodos: async (): Promise<Todo[]> => {
    const response = await apiClient.get<ApiResponse<Todo[]>>('/todos')
    return response.data.data
  },

  // Create one
  createTodo: async (todo: CreateTodo): Promise<Todo> => {
    const response = await apiClient.post<ApiResponse<Todo>>('/todos', todo)
    return response.data.data
  },

  // Update one
  updateTodo: async (id: string, todo: UpdateTodo): Promise<Todo> => {
    const response = await apiClient.put<ApiResponse<Todo>>(`/todos/${id}`, todo)
    return response.data.data
  },

  // Delete one
  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`)
  },

}
