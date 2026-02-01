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
          class="w-24 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-text-main dark:text-dark-text-main border border-border dark:border-dark-border hover:bg-background dark:hover:bg-dark-background"
        >
          {{ cancelText }}
        </button>
        <button
          @click="onConfirm"
          :disabled="loading"
          class="w-28 px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50"
          :class="confirmClass"
        >
          {{ loading ? loadingText : confirmText }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'

type ModalVariant = 'danger' | 'primary'

export default Vue.extend({
  name: 'ConfirmModal',
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
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Yes'
    },
    cancelText: {
      type: String,
      default: 'No'
    },
    loadingText: {
      type: String,
      default: 'Please wait...'
    },
    loading: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String as () => ModalVariant,
      default: 'danger' as ModalVariant
    }
  },
  computed: {
    confirmClass(): string {
      if (this.variant === 'danger') {
        return 'bg-red-500 text-white hover:enabled:bg-red-600'
      }
      return 'bg-primary dark:bg-dark-primary text-white hover:enabled:opacity-90'
    }
  },
  methods: {
    onConfirm(): void {
      if (!this.loading) {
        this.$emit('confirm')
      }
    },
    onCancel(): void {
      if (!this.loading) {
        this.$emit('cancel')
      }
    }
  }
})
</script>
