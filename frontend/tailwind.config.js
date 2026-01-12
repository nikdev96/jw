/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Telegram theme variables (light mode)
        'tg-bg': 'var(--tg-theme-bg-color)',
        'tg-text': 'var(--tg-theme-text-color)',
        'tg-hint': 'var(--tg-theme-hint-color)',
        'tg-button': 'var(--tg-theme-button-color)',
        'tg-button-text': 'var(--tg-theme-button-text-color)',
        'tg-secondary-bg': 'var(--tg-theme-secondary-bg-color)',

        // Dark mode colors (premium iOS-style)
        dark: {
          bg: '#0F1115',        // background (NOT pure black)
          surface: '#171A21',   // surface level
          card: '#1C2028',      // card background
          border: '#2A2E38',    // borders
        },
        // Accent color (lime/neon green)
        accent: {
          DEFAULT: '#C7F000',
          soft: 'rgba(199, 240, 0, 0.15)',
          glow: 'rgba(199, 240, 0, 0.3)',
        },
      },
    },
  },
  plugins: [],
}
