<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <button 
    @click="themeStore.toggle"
    class="w-full px-4 py-2 rounded bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover transition-colors text-white font-medium"
  >
    {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
  </button>
</template>
