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
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-text-main dark:text-dark-text-main">
              Title*
            </label>
            <span class="text-xs text-text-secondary dark:text-dark-text-secondary" :class="{ 'text-red-500 dark:text-red-400': localTitle.length === 100 || localTitle.trim().length === 0 }"	>
              {{ localTitle.length }}/100
            </span>
          </div>
          <input
            v-model="localTitle"
            type="text"
            placeholder="Title*"
            maxlength="100"
            :disabled="loading"
            :class="[
              'w-full px-3 py-2 bg-background dark:bg-dark-background text-text-main dark:text-dark-text-main rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors',
              localTitle.trim().length === 0 && localTitle.length > 0
                ? 'border-2 border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400'
                : 'border border-border dark:border-dark-border focus:ring-primary dark:focus:ring-dark-primary'
            ]"
          />
          <p 
            v-if="localTitle.trim().length === 0 || localTitle.trim().length === 0 && localTitle.length > 0"
            class="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            Title cannot be empty or contain only spaces
          </p>
        </div>
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-text-main dark:text-dark-text-main">
              Description
            </label>
            <span class="text-xs text-text-secondary dark:text-dark-text-secondary" :class="{ 'text-red-500 dark:text-red-400': localDescription.length === 100 || localDescription.trim().length === 0 }">
              {{ localDescription.length }}/100
            </span>
          </div>
          <textarea
            v-model="localDescription"
            placeholder="Description"
            :disabled="loading"
            rows="3"
            maxlength="100"
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
          class="w-24 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-text-main dark:text-dark-text-main border border-border dark:border-dark-border hover:bg-background dark:hover:bg-dark-background"
        >
          Cancel
        </button>
        <button
          @click="onSave"
          :disabled="!localTitle.trim() || loading"
          class="w-24 px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50 bg-primary dark:bg-dark-primary text-white hover:enabled:opacity-90"
        >
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'

interface SaveData {
  title: string
  description: string
}

export default Vue.extend({
  name: 'EditModal',
  components: {
    BaseModal
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localTitle: '',
      localDescription: ''
    }
  },
  watch: {
    isOpen(newVal: boolean) {
      if (newVal) {
        this.localTitle = this.title
        this.localDescription = this.description
      }
    }
  },
  methods: {
    onSave(): void {
      if (!this.localTitle.trim() || this.loading) return
      
      this.$emit('save', {
        title: this.localTitle.trim(),
        description: this.localDescription.trim()
      } as SaveData)
    },
    onCancel(): void {
      if (!this.loading) {
        this.$emit('cancel')
      }
    }
  }
})
</script>
