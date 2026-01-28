/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts}"
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Light theme
          background: '#FFFFFF',
          surface: '#F8FAFC',
          border: '#E5E7EB',
          'text-main': '#0F172A',
          'text-muted': '#64748B',
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          
          // Dark theme
          'dark-background': '#0B1220',
          'dark-surface': '#111827',
          'dark-border': '#1F2937',
          'dark-text-main': '#E5E7EB',
          'dark-text-muted': '#9CA3AF',
          'dark-primary': '#3B82F6',
          'dark-primary-hover': '#60A5FA',
        },
      },
    },
    plugins: [],
  }
  