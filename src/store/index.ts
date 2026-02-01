import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import themeModule from './modules/theme';
import listsModule from './modules/lists';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    theme: themeModule,
    lists: listsModule
  },
  actions: {
    init({ dispatch }) {
      dispatch('theme/init');
      dispatch('lists/fetchLists');
    }
  }
};

export default new Vuex.Store<RootState>(store);
