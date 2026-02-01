<template>
  <BaseModal :is-open="isOpen" @close="cancel">
    <template #header>
      <h2 class="text-xl font-bold text-text-main dark:text-dark-text-main">Create New List</h2>
    </template>
    
    <template #body>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-main dark:text-dark-text-main mb-2">
            List Name
          </label>
          <input
            ref="input"
            v-model="listName"
            @keyup.enter="save"
            type="text"
            placeholder="Enter list name..."
            maxlength="50"
            class="w-full px-4 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg text-text-main dark:text-dark-text-main placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:border-primary dark:focus:border-dark-primary"
          />
          <div class="mt-1 flex justify-between items-center">
            <p v-if="displayError" class="text-xs text-red-500 dark:text-red-400">
              {{ displayError }}
            </p>
            <span v-else class="text-xs text-text-secondary dark:text-dark-text-secondary">
              {{ listName.length }}/50
            </span>
          </div>
        </div>
      </div>
    </template>
    
    <template #footer>
      <div class="flex gap-3 justify-end">
        <button
          @click="cancel"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-text-main dark:text-dark-text-main hover:bg-background dark:hover:bg-dark-background rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          @click="save"
          :disabled="!listName.trim() || loading"
          class="px-4 py-2 text-sm font-medium bg-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {{ loading ? 'Creating...' : 'Create' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'

export default Vue.extend({
  name: 'NewListModal',
  components: {
    BaseModal
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    externalError: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listName: '',
      error: ''
    }
  },
  computed: {
    displayError(): string {
      return this.externalError || this.error
    }
  },
  watch: {
    isOpen(newVal: boolean) {
      if (newVal) {
        this.listName = ''
        this.error = ''
        this.$nextTick(() => {
          (this.$refs.input as HTMLInputElement)?.focus()
        })
      }
    },
    listName() {
      this.error = ''
    }
  },
  methods: {
    save() {
      const trimmed = this.listName.trim()
      if (!trimmed) return

      const existingLists = this.$store.getters['lists/all'] as string[]
      if (existingLists.some(listName => listName.toLowerCase() === trimmed.toLowerCase())) {
        this.error = 'A list with this name already exists'
        return
      }
      
      this.$emit('save', trimmed)
    },
    cancel() {
      this.$emit('cancel')
    }
  }
})
</script>
