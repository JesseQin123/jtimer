/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors - Neon Pink/Green
        primary: '#FF00CC',
        'primary-dark': '#CC00A3',
        secondary: '#00FF66',
        accent: '#CC00FF', // Purple for secondary rings

        // Background colors
        background: '#000000',
        surface: '#1C1C1E',
        'surface-light': '#2C2C2E',
        'surface-lighter': '#3A3A3C',

        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#8E8E93',
        'text-tertiary': '#636366',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(255, 0, 204, 0.4)',
        'glow-secondary': '0 0 15px rgba(0, 255, 102, 0.3)',
        'glow-accent': '0 0 15px rgba(204, 0, 255, 0.3)',
        'glow-sm-primary': '0 0 10px rgba(255, 0, 204, 0.3)',
        'glow-sm-secondary': '0 0 10px rgba(0, 255, 102, 0.25)',
        'glow-sm-accent': '0 0 10px rgba(204, 0, 255, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 0, 204, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 0, 204, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
