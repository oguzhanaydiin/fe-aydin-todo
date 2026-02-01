<template>
  <div class="h-full flex flex-col items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-8xl font-bold text-primary dark:text-dark-primary mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-text-main dark:text-dark-text-main mb-2">
        List Not Found
      </h2>
      <p class="text-text-secondary dark:text-dark-text-secondary mb-8">
        The list you're looking for doesn't exist.
      </p>
      <router-link 
        to="/" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        <Icon icon="heroicons-outline:home" class="w-5 h-5" />
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'

export default Vue.extend({
  name: 'NotFound',
  components: { Icon },
  mounted() {
    document.title = '404 - List Not Found | AydinTodo'
  }
})
</script>
