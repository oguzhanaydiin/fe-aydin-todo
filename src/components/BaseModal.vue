<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click.self="handleBackdropClick"
  >
    <!-- background shadow -->
    <div 
      class="absolute inset-0 bg-black/50"
      @click="handleBackdropClick"
    />
    
    <div 
      class="relative bg-surface dark:bg-dark-surface rounded-lg shadow-xl border border-border dark:border-dark-border w-full"
      :class="sizeClass"
    >
      <!-- Header -->
      <div 
        v-if="$slots.header"
        class="px-6 pt-6 pb-4 border-b border-border dark:border-dark-border"
      >
        <slot name="header" />
      </div>

      <!-- Body -->
      <div 
        v-if="$slots.body || $slots.default"
        class="p-6"
      >
        <slot name="body">
          <slot />
        </slot>
      </div>

      <!-- Footer -->
      <div 
        v-if="$slots.footer"
        class="px-6 pb-6 pt-0"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl' | '2xl',
    default: 'md'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const sizeClass = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }
  return sizes[props.size]
})

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}
</script>
