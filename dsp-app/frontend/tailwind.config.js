/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nord: {
          bg: '#16191e',
          surface: '#1c2028',
          elevated: '#232830',
          border: '#2e3440',
          'border-light': '#3b4252',
          // Nord Polar Night
          'polar-0': '#2e3440',
          'polar-1': '#3b4252',
          'polar-2': '#434c5e',
          'polar-3': '#4c566a',
          // Nord Snow Storm
          'snow-0': '#d8dee9',
          'snow-1': '#e5e9f0',
          'snow-2': '#eceff4',
          // Nord Frost
          'frost-0': '#8fbcbb',
          'frost-1': '#88c0d0',
          'frost-2': '#81a1c1',
          'frost-3': '#5e81ac',
          // Nord Aurora
          'aurora-red': '#bf616a',
          'aurora-orange': '#d08770',
          'aurora-yellow': '#ebcb8b',
          'aurora-green': '#a3be8c',
          'aurora-purple': '#b48ead',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(136, 192, 208, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(136, 192, 208, 0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
