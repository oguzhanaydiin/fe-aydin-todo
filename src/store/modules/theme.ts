import { Module } from 'vuex';
import { RootState } from '../types';

export interface ThemeState {
  isDark: boolean;
}

const themeModule: Module<ThemeState, RootState> = {
  namespaced: true,
  state: {
    isDark: false
  },
  mutations: {
    SET_THEME(state, isDark: boolean) {
      state.isDark = isDark;
    }
  },
  actions: {
    init({ commit }) {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        commit('SET_THEME', true);
        document.documentElement.classList.add('dark');
      }
    },
    toggle({ commit, state }) {
      const newTheme = !state.isDark;
      commit('SET_THEME', newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');

      if (newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  getters: {
    isDark: (state) => state.isDark
  }
};

export default themeModule;
