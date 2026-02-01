<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'EmptyState',
  props: {
    type: {
      type: String as () => 'loading' | 'error' | 'empty',
      default: 'empty'
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    textColorClass(): string {
      if (this.type === 'error') {
        return 'text-error'
      }
      return 'text-text-secondary dark:text-dark-text-secondary'
    }
  }
})
</script>

<template>
  <div class="text-center py-12">
    <p class="text-lg" :class="textColorClass">
      {{ message }}
    </p>
  </div>
</template>
