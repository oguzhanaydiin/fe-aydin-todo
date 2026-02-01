import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.AYDIN_TODO_API_URL,
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
  listName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodo {
  title: string
  description?: string
  listName?: string
}

export interface UpdateTodo {
  title?: string
  description?: string
  completed?: boolean
  listName?: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface List {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateList {
  name: string
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

export const listsApi = {
  // Get all lists
  getLists: async (): Promise<List[]> => {
    const response = await apiClient.get<ApiResponse<List[]>>('/lists')
    return response.data.data
  },

  // Create a list
  createList: async (list: CreateList): Promise<List> => {
    const response = await apiClient.post<ApiResponse<List>>('/lists', list)
    return response.data.data
  },

  // Delete a list
  deleteList: async (name: string): Promise<void> => {
    await apiClient.delete(`/lists/${name.replace(/ /g, '_')}`)
  },
}
