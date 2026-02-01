import { Module } from 'vuex'
import { RootState } from '../types'
import { listsApi, type List } from '@/services/api'

export interface ListsState {
  lists: List[]
  loading: boolean
  error: string | null
}

const listsModule: Module<ListsState, RootState> = {
  namespaced: true,
  state: (): ListsState => ({
    lists: [],
    loading: false,
    error: null
  }),
  mutations: {
    SET_LISTS(state, lists: List[]) {
      state.lists = lists
    },
    ADD_LIST(state, list: List) {
      state.lists.push(list)
    },
    REMOVE_LIST(state, name: string) {
      state.lists = state.lists.filter(listItem => listItem.name !== name)
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    }
  },
  actions: {
    async fetchLists({ commit }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const lists = await listsApi.getLists()
        commit('SET_LISTS', lists)
      } catch (error) {
        console.error('Error fetching lists:', error)
        commit('SET_ERROR', 'Failed to load lists')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async addList({ commit }, listName: string) {
      try {
        commit('SET_ERROR', null)
        const newList = await listsApi.createList({ name: listName })
        commit('ADD_LIST', newList)
        return newList
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to create list'
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      }
    },
    async deleteList({ commit }, listName: string) {
      try {
        commit('SET_ERROR', null)
        await listsApi.deleteList(listName)
        commit('REMOVE_LIST', listName)
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to delete list'
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      }
    }
  },
  getters: {
    all: (state) => state.lists.map(listItem => listItem.name),
    loading: (state) => state.loading,
    error: (state) => state.error
  }
}

export default listsModule
