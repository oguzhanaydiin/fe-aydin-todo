<template>
  <button 
    @click="toggleTheme"
    class="p-2 bg-primary dark:bg-dark-primary text-white hover:opacity-90 rounded-lg transition-all"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <Icon :icon="isDark ? 'heroicons-outline:sun' : 'heroicons-outline:moon'" class="w-5 h-5" />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { Icon } from '@iconify/vue2'

export default Vue.extend({
  name: 'ColorModeToggle',
  components: { Icon },
  computed: {
    isDark(): boolean {
      return this.$store.getters['theme/isDark']
    }
  },
  methods: {
    toggleTheme(): void {
      this.$store.dispatch('theme/toggle')
    }
  }
})
</script>
