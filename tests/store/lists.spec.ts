import Vuex, { Store } from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import listsModule, { ListsState } from '@/store/modules/lists'
import { RootState } from '@/store/types'
import { listsApi } from '@/services/api'

jest.mock('@/services/api', () => ({
  listsApi: {
    getLists: jest.fn(),
    createList: jest.fn(),
    deleteList: jest.fn(),
  },
}))

const localVue = createLocalVue()
localVue.use(Vuex)

describe('lists store', () => {
  let store: Store<RootState>

  const mockList = {
    _id: '1',
    name: 'Work',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    store = new Vuex.Store({ modules: { lists: listsModule } })
  })

  const getState = () => (store.state as any).lists as ListsState

  it('fetches lists from API', async () => {
    jest.mocked(listsApi.getLists).mockResolvedValue([mockList])

    await store.dispatch('lists/fetchLists')

    expect(getState().lists).toEqual([mockList])
  })

  it('adds a new list', async () => {
    jest.mocked(listsApi.createList).mockResolvedValue(mockList)

    await store.dispatch('lists/addList', 'Work')

    expect(listsApi.createList).toHaveBeenCalledWith({ name: 'Work' })
    expect(getState().lists).toContainEqual(mockList)
  })

  it('deletes a list', async () => {
    store.commit('lists/SET_LISTS', [mockList])
    jest.mocked(listsApi.deleteList).mockResolvedValue(undefined)

    await store.dispatch('lists/deleteList', 'Work')

    expect(getState().lists).toHaveLength(0)
  })
})
