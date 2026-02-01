import Vuex, { Store } from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import todosModule, { TodosState } from '@/store/modules/todos'
import { RootState } from '@/store/types'
import { todosApi, type Todo } from '@/services/api'

jest.mock('@/services/api', () => ({
  todosApi: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}))

const localVue = createLocalVue()
localVue.use(Vuex)

describe('todos store', () => {
  let store: Store<RootState>

  const mockTodo: Todo = {
    _id: '1',
    title: 'Test Todo',
    description: 'Description',
    completed: false,
    deleted: false,
    listName: 'General',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    store = new Vuex.Store({ modules: { todos: todosModule } })
  })

  const getState = () => (store.state as any).todos as TodosState

  it('fetches todos from API', async () => {
    jest.mocked(todosApi.getTodos).mockResolvedValue([mockTodo])

    await store.dispatch('todos/fetchTodos')

    expect(getState().todos).toEqual([mockTodo])
  })

  it('adds a new todo', async () => {
    jest.mocked(todosApi.createTodo).mockResolvedValue(mockTodo)

    const result = await store.dispatch('todos/addTodo', { title: 'New Todo' })

    expect(todosApi.createTodo).toHaveBeenCalledWith({ title: 'New Todo' })
    expect(result).toEqual(mockTodo)
  })

  it('updates a todo', async () => {
    store.commit('todos/SET_TODOS', [mockTodo])
    const updated = { ...mockTodo, completed: true }
    jest.mocked(todosApi.updateTodo).mockResolvedValue(updated)

    await store.dispatch('todos/updateTodo', { id: '1', updates: { completed: true } })

    expect(getState().todos[0].completed).toBe(true)
  })

  it('deletes a todo', async () => {
    store.commit('todos/SET_TODOS', [mockTodo])
    jest.mocked(todosApi.deleteTodo).mockResolvedValue(undefined)

    await store.dispatch('todos/deleteTodo', '1')

    expect(getState().todos).toHaveLength(0)
  })

  it('sets error on API failure', async () => {
    const error = { response: { data: { error: 'Something went wrong' } } }
    jest.mocked(todosApi.createTodo).mockRejectedValue(error)

    await expect(store.dispatch('todos/addTodo', {})).rejects.toThrow()
    expect(getState().error).toBe('Something went wrong')
  })
})
