import axios from 'axios'

const apiUrl = process.env.AYDIN_TODO_API_URL

interface ErrorPayload {
  source: 'frontend'
  message: string
  stack?: string
  route?: string
}

// Send error to backend
const sendError = (payload: ErrorPayload): void => {
  axios.post(`${apiUrl}/error-logs`, payload).catch(() => {
    // Silently fail - don't cause more errors
  })
}

// Check if it's an ignorable error
const shouldIgnore = (error: Error | string): boolean => {
  const message = typeof error === 'string' ? error : error.message || ''

  // Ignore 4xx client errors
  if (message.includes('400') || message.includes('401') ||
    message.includes('403') || message.includes('404') ||
    message.includes('422')) {
    return true
  }

  const ignoredPatterns = [
    'validation',
    'required',
    'invalid',
    'already exists',
    'not found',
    'Network Error',
  ]

  return ignoredPatterns.some(p => message.toLowerCase().includes(p.toLowerCase()))
}

// Log unexpected errors only
export const logError = (error: Error): void => {
  if (shouldIgnore(error)) return

  sendError({
    source: 'frontend',
    message: error.message,
    stack: error.stack,
    route: window.location.pathname,
  })
}

// Setup global error handlers
export const setupErrorLogging = (): void => {
  // Catch unhandled JS errors
  window.onerror = (_message, _source, _line, _col, error) => {
    if (error && !shouldIgnore(error)) {
      logError(error)
    }
    return false
  }

  // Catch unhandled promise rejections
  window.onunhandledrejection = (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason))

    if (!shouldIgnore(error)) {
      logError(error)
    }
  }
}

// Vue error handler (call in main.ts)
export const vueErrorHandler = (err: Error): void => {
  logError(err)
}
