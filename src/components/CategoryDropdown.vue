<template>
  <div class="relative">
    <button
      ref="button"
      @click.stop="isOpen = !isOpen"
      :disabled="disabled"
      class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors rounded-md border border-border dark:border-dark-border hover:border-primary dark:hover:border-dark-primary disabled:opacity-50"
      title="Category"
    >
      <IconFolder class="h-4 w-4" />
      <span>{{ value || 'General' }}</span>
    </button>
    
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40" />
    
    <div
      v-if="isOpen"
      :style="position"
      class="fixed bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg shadow-lg py-1 z-50 min-w-[150px]"
    >
      <button
        @click.stop="selectCategory('')"
        class="w-full px-4 py-2 text-left text-sm hover:bg-background dark:hover:bg-dark-background transition-colors"
        :class="value === '' ? 'text-primary dark:text-dark-primary font-medium' : 'text-text-main dark:text-dark-text-main'"
      >
        General
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconFolder from './icons/IconFolder.vue'

export default Vue.extend({
  name: 'CategoryDropdown',
  components: { IconFolder },
  props: {
    value: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    position() {
      if (!this.isOpen) return {}
      // get the position of the button position
      const btn = this.$refs.button as HTMLElement
      if (!btn) return {}
      const rect = btn.getBoundingClientRect()
      return {
        top: `${rect.top - 8}px`,
        right: `${window.innerWidth - rect.right}px`,
        transform: 'translateY(-100%)'
      }
    }
  },
  methods: {
    selectCategory(category: string) {
      this.$emit('input', category)
      this.isOpen = false
    }
  }
})
</script>
