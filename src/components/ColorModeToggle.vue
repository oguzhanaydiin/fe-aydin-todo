<template>
  <button 
    @click="toggleTheme"
    class="w-full px-4 py-2 rounded bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover transition-colors text-white font-medium"
  >
    {{ isDark ? 'Light Mode' : 'Dark Mode' }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ColorModeToggle',
  computed: {
    isDark(): boolean {
      return this.$store.getters.isDark
    }
  },
  methods: {
    toggleTheme(): void {
      this.$store.dispatch('toggle')
    }
  }
})
</script>
