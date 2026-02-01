import Vue from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

// Event bus for toast notifications
export const ToastBus = new Vue()

let toastId = 0

export const toast = {
  show(message: string, type: ToastType = 'info', duration = 3000) {
    const id = ++toastId
    ToastBus.$emit('show', { id, message, type, duration })
  },
  success(message: string, duration = 3000) {
    this.show(message, 'success', duration)
  },
  error(message: string, duration = 4000) {
    this.show(message, 'error', duration)
  },
  warning(message: string, duration = 3500) {
    this.show(message, 'warning', duration)
  },
  info(message: string, duration = 3000) {
    this.show(message, 'info', duration)
  }
}
