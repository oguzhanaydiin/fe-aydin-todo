<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ColorModeToggle from '@/components/ColorModeToggle.vue'
import MobileDrawer from '@/components/MobileDrawer.vue'
import IconMenu from '@/components/icons/IconMenu.vue'

const themeStore = useThemeStore()
const isMobileMenuOpen = ref(false)

onMounted(() => {
  themeStore.init()
})
</script>

<template>
  <div class="flex h-full">
    <!-- mobile header -->
    <div class="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border z-30 flex items-center px-4">
      <button
        @click="isMobileMenuOpen = true"
        class="p-2 hover:bg-background dark:hover:bg-dark-background rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <IconMenu class="w-6 h-6 text-text-main dark:text-dark-text-main" />
      </button>
      <h1 class="ml-3 text-lg font-bold text-text-main dark:text-dark-text-main">AydinTodo</h1>
    </div>

    <!-- mobile navigation -->
    <MobileDrawer
      :is-open="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
    />

    <!-- desktop sidebar -->
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

    <!-- Main content -->
    <main class="flex-1 overflow-hidden pt-14 md:pt-0">
      <router-view />
    </main>
  </div>
</template>
