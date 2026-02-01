import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/:list',
    name: 'list',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

export default router
