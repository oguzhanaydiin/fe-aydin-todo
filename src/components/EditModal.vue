<template>
  <BaseModal
    :is-open="isOpen"
    :close-on-backdrop="!loading"
    size="2xl"
    @close="onCancel"
  >
    <template #header>
      <h3 class="text-lg font-semibold text-text-main dark:text-dark-text-main">
        Edit Todo
      </h3>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-text-main dark:text-dark-text-main mb-2">
            Title*
          </label>
          <input
            v-model="localTitle"
            type="text"
            placeholder="Title*"
            :disabled="loading"
            class="w-full px-3 py-2 bg-background dark:bg-dark-background text-text-main dark:text-dark-text-main border border-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary disabled:opacity-50"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-main dark:text-dark-text-main mb-2">
            Description
          </label>
          <textarea
            v-model="localDescription"
            placeholder="Description"
            :disabled="loading"
            rows="3"
            class="w-full px-3 py-2 bg-background dark:bg-dark-background text-text-main dark:text-dark-text-main border border-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary disabled:opacity-50 resize-none"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-center gap-3">
        <button
          @click="onCancel"
          :disabled="loading"
          class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-text-main dark:text-dark-text-main border border-border dark:border-dark-border hover:bg-background dark:hover:bg-dark-background"
        >
          Cancel
        </button>
        <button
          @click="onSave"
          :disabled="!localTitle.trim() || loading"
          class="px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50 bg-primary dark:bg-dark-primary text-white hover:enabled:opacity-90"
        >
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'

interface Props {
  isOpen: boolean
  title: string
  description: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits(['save', 'cancel'])

const localTitle = ref('')
const localDescription = ref('')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    localTitle.value = props.title
    localDescription.value = props.description
  }
})

const onSave = () => {
  if (!localTitle.value.trim() || props.loading) return
  
  emit('save', {
    title: localTitle.value.trim(),
    description: localDescription.value.trim()
  })
}

const onCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}
</script>
