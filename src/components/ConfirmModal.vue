<template>
  <BaseModal
    :is-open="isOpen"
    :close-on-backdrop="!loading"
    size="md"
    @close="onCancel"
  >
    <template #header>
      <h3 class="text-lg font-semibold text-text-main dark:text-dark-text-main">
        {{ title }}
      </h3>
    </template>

    <template #body>
      <p class="text-text-secondary dark:text-dark-text-secondary">
        {{ message }}
      </p>
    </template>

    <template #footer>
      <div class="flex justify-center gap-3">
        <button
          @click="onCancel"
          :disabled="loading"
          class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-text-main dark:text-dark-text-main border border-border dark:border-dark-border hover:bg-background dark:hover:bg-dark-background"
        >
          {{ cancelText }}
        </button>
        <button
          @click="onConfirm"
          :disabled="loading"
          class="px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50"
          :class="confirmClass"
        >
          {{ loading ? loadingText : confirmText }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loadingText?: string
  loading?: boolean
  variant?: 'danger' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Yes',
  cancelText: 'No',
  loadingText: 'Please wait...',
  loading: false,
  variant: 'danger'
})

const emit = defineEmits(['confirm', 'cancel'])

const confirmClass = computed(() => {
  if (props.variant === 'danger') {
    return 'bg-red-500 text-white hover:enabled:bg-red-600'
  }
  return 'bg-primary dark:bg-dark-primary text-white hover:enabled:opacity-90'
})

const onConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const onCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}
</script>
