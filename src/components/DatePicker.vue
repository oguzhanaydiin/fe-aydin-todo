<template>
  <div class="relative">
    <button
      ref="button"
      @click.stop="isOpen = !isOpen"
      :disabled="disabled"
      class="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors rounded-md border disabled:opacity-50"
      :class="value 
        ? 'text-primary dark:text-dark-primary border-primary dark:border-dark-primary' 
        : 'text-text-secondary dark:text-dark-text-secondary border-border dark:border-dark-border hover:text-primary dark:hover:text-dark-primary hover:border-primary dark:hover:border-dark-primary'"
      title="Due date"
    >
      <IconCalendar class="h-4 w-4" />
      <span v-if="value">{{ formatDate(value) }}</span>
      <span v-else>Date</span>
    </button>
    
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40" />
    
    <div
      v-if="isOpen"
      :style="position"
      class="fixed bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg shadow-lg p-3 z-50"
    >
      <input
        v-model="localDate"
        type="date"
        class="bg-transparent text-sm text-text-main dark:text-dark-text-main border border-border dark:border-dark-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary dark:[color-scheme:dark]"
      />
      <div class="flex gap-2 mt-2">
        <button
          @click.stop="clearDate"
          class="flex-1 px-2 py-1 text-xs text-text-secondary dark:text-dark-text-secondary hover:text-text-main dark:hover:text-dark-text-main"
        >
          Clear
        </button>
        <button
          @click.stop="done"
          class="flex-1 px-2 py-1 text-xs bg-primary dark:bg-dark-primary text-white rounded"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconCalendar from './icons/IconCalendar.vue'

export default Vue.extend({
  name: 'DatePicker',
  components: { IconCalendar },
  props: {
    value: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      isOpen: false,
      localDate: this.value
    }
  },
  computed: {
    position() {
      if (!this.isOpen) return {}
      const btn = this.$refs.button as HTMLElement
      if (!btn) return {}
      // get the position of the button position
      const rect = btn.getBoundingClientRect()
      return {
        top: `${rect.top - 8}px`,
        right: `${window.innerWidth - rect.right}px`,
        transform: 'translateY(-100%)'
      }
    }
  },
  watch: {
    value(newVal) {
      this.localDate = newVal
    }
  },
  methods: {
    clearDate() {
      this.localDate = ''
      this.$emit('input', '')
      this.isOpen = false
    },
    done() {
      this.$emit('input', this.localDate)
      this.isOpen = false
    },
    formatDate(dateString: string): string {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }
})
</script>
