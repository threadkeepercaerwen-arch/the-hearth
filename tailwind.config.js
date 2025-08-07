/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'white/10': 'rgba(255, 255, 255, 0.1)',
        'white/20': 'rgba(255, 255, 255, 0.2)',
        'white/30': 'rgba(255, 255, 255, 0.3)',
        'white/40': 'rgba(255, 255, 255, 0.4)',
        'white/50': 'rgba(255, 255, 255, 0.5)',
        'white/60': 'rgba(255, 255, 255, 0.6)',
        'white/70': 'rgba(255, 255, 255, 0.7)',
        'white/80': 'rgba(255, 255, 255, 0.8)',
        'black/20': 'rgba(0, 0, 0, 0.2)',
        'black/40': 'rgba(0, 0, 0, 0.4)',
        'black/60': 'rgba(0, 0, 0, 0.6)',
        'black/80': 'rgba(0, 0, 0, 0.8)',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts
  },
} 