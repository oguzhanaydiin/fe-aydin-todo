<script lang="ts">
import Vue from 'vue'
import { ToastBus, Toast, ToastType } from '@/services/toast'

export default Vue.extend({
  name: 'ToastContainer',
  data() {
    return {
      toasts: [] as Toast[]
    }
  },
  mounted() {
    ToastBus.$on('show', this.addToast)
  },
  beforeDestroy() {
    ToastBus.$off('show', this.addToast)
  },
  methods: {
    addToast({ id, message, type, duration }: Toast & { duration: number }) {
      this.toasts.push({ id, message, type })
      
      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    },
    removeToast(id: number) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },
    getIcon(type: ToastType): string {
      const icons: Record<ToastType, string> = {
        success: 'mdi:check-circle',
        error: 'mdi:alert-circle',
        warning: 'mdi:alert',
        info: 'mdi:information'
      }
      return icons[type]
    }
  }
})
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-sm animate-slide-in-right"
      :class="{
        'bg-success text-white': t.type === 'success',
        'bg-error text-white': t.type === 'error',
        'bg-warning text-white': t.type === 'warning',
        'bg-info text-white': t.type === 'info'
      }"
    >
      <iconify-icon :icon="getIcon(t.type)" class="text-xl flex-shrink-0" />
      <span class="flex-1 text-sm font-medium">{{ t.message }}</span>
      <button
        class="p-1 hover:bg-white/20 rounded transition-colors"
        @click="removeToast(t.id)"
      >
        <iconify-icon icon="mdi:close" class="text-lg" />
      </button>
    </div>
  </div>
</template>
