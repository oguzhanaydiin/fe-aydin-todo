import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import store from '../store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'general',
    component: Home
  },
  {
    path: '/404',
    name: 'not-found',
    component: NotFound
  },
  {
    path: '/:list',
    name: 'list',
    component: Home,
    beforeEnter: async (to, from, next) => {
      const listParam = to.params.list.replace(/_/g, ' ')

      // Wait for lists to load if not already
      let lists: string[] = store.getters['lists/all']
      if (lists.length === 0) {
        await store.dispatch('lists/fetchLists')
        lists = store.getters['lists/all']
      }

      if (lists.includes(listParam)) {
        next()
      } else {
        next('/404')
      }
    }
  },
  // ...no catch-all route...
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_ENVIRONMENT === 'gh-pages' ? '/fe-aydin-todo/' : '/',
  routes
})

export default router
