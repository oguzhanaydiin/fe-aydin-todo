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
  createdAt: string
  updatedAt: string
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

  // Create a new todo
  createTodo: async (title: string, description = ''): Promise<Todo> => {
    const response = await apiClient.post<ApiResponse<Todo>>('/todos', { title, description })
    return response.data.data
  },

}
