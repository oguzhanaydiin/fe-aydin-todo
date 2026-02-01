import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { setupErrorLogging, vueErrorHandler } from './services/errorLogger'


import './assets/tailwind.css'

// Log environment variable for Vercel build log debugging
console.log('VUE_APP_AYDIN_TODO_API_URL:', process.env.VUE_APP_AYDIN_TODO_API_URL)

// Setup global error logging (catches runtime errors)
setupErrorLogging()
Vue.config.errorHandler = vueErrorHandler

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
