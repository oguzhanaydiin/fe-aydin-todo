<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ColorModeToggle from '@/components/ColorModeToggle.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.init()
})
</script>

<template>
  <div class="flex h-full">
    <nav class="hidden md:flex md:flex-col w-64 bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text-main border-r border-border dark:border-dark-border">
      <div class="p-4 border-b border-border dark:border-dark-border">
        <h1 class="text-xl font-bold">AydinTodo</h1>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li>
            <router-link 
              to="/"
              class="block px-4 py-2 rounded hover:bg-primary hover:text-white dark:hover:bg-dark-primary transition-colors"
              active-class="bg-primary text-white dark:bg-dark-primary"
            >
              General
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="p-4 border-t border-border dark:border-dark-border">
        <ColorModeToggle />
      </div>
    </nav>

    <main class="flex-1 overflow-hidden">
      <router-view />
    </main>
  </div>
</template>
