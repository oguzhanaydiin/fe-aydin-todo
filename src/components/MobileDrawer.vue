
<template>
  <div v-if="isVisible">
    <!-- background shadow -->
    <div
    
    @click="close"
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    />

    <nav
    class="fixed top-0 left-0 h-full w-64 bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text-main border-r border-border dark:border-dark-border z-50 flex flex-col md:hidden transition-transform duration-300 ease-out"
    :class="isAnimating ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Header -->
      <div class="p-4 border-b border-border dark:border-dark-border flex items-center justify-between">
        <h1 class="text-xl font-bold">AydinTodo</h1>
        <button
          @click="close"
          class="p-2 hover:bg-background dark:hover:bg-dark-background rounded-lg transition-colors"
          aria-label="Close menu"
          >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li>
            <router-link
            to="/"
            class="block px-4 py-2 rounded hover:bg-primary hover:text-white dark:hover:bg-dark-primary transition-colors"
            active-class="bg-primary text-white dark:bg-dark-primary"
            @click.native="close"
            >
              General
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-border dark:border-dark-border">
        <ColorModeToggle />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import ColorModeToggle from '@/components/ColorModeToggle.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)
const isAnimating = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    isVisible.value = true
    setTimeout(() => {
      isAnimating.value = true
    }, 10)
  } else {
    isAnimating.value = false
    setTimeout(() => {
      isVisible.value = false
    }, 300)
  }
})

const close = () => {
  emit('close')
}
</script>