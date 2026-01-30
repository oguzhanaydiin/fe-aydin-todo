<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleBackdropClick"
      >
        <!-- Background Shadow -->
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        />
        
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="isOpen"
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
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isOpen: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true
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
