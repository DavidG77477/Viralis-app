/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-green': '#00FF99',
        'secondary': '#1A1A1A',
        'muted': '#B3B3B3',
        'slate': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(90deg, #00FF99 0%, #00D084 100%)',
        'panel-gradient': 'linear-gradient(165deg, hsl(222 47% 14% / 1), hsl(222 47% 11% / 1))',
      },
      boxShadow: {
        'inner-panel': 'inset 0 1px 0 0 hsl(0 0% 100% / 0.03)',
      },
      animation: {
        'text-gradient': 'text-gradient 1.5s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'border-pulse': 'border-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'carousel-scroll': 'carousel-scroll 60s linear infinite',
        'slow-spin': 'spin 20s linear infinite',
        'aurora-1': 'aurora-1 25s ease-in-out infinite alternate',
        'aurora-2': 'aurora-2 30s ease-in-out infinite alternate',
        'gradient-orbit': 'gradient-orbit 22s ease-in-out infinite alternate',
        'gradient-orbit-rev': 'gradient-orbit-rev 26s ease-in-out infinite alternate',
        'gradient-pulse': 'gradient-pulse 18s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'text-gradient': {
          'to': {
            'background-position': '200% center',
          },
        },
        'fade-in': {
          'from': { opacity: 0, transform: 'translateY(-10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in-up': {
          'from': { opacity: 0, transform: 'translateY(20px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
        'border-pulse': {
          '0%, 100%': { 'border-color': 'rgba(0, 255, 153, 0.4)' },
          '50%': { 'border-color': 'rgba(0, 255, 153, 0.9)' },
        },
        'carousel-scroll': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-100%)' },
        },
        'aurora-1': {
          'from': { transform: 'translate(-20%, 10%) scale(1)' },
          'to': { transform: 'translate(20%, -10%) scale(1.3)' },
        },
        'aurora-2': {
          'from': { transform: 'translate(15%, -15%) scale(1.2)' },
          'to': { transform: 'translate(-15%, 15%) scale(0.9)' },
        },
        'gradient-orbit': {
          '0%': { transform: 'translate(-20%, -10%) scale(0.95)', opacity: 0.35 },
          '50%': { transform: 'translate(5%, 10%) scale(1.1)', opacity: 0.55 },
          '100%': { transform: 'translate(18%, -5%) scale(1.25)', opacity: 0.4 },
        },
        'gradient-orbit-rev': {
          '0%': { transform: 'translate(18%, 12%) scale(1.05)', opacity: 0.35 },
          '50%': { transform: 'translate(-8%, -6%) scale(1.22)', opacity: 0.55 },
          '100%': { transform: 'translate(-24%, 8%) scale(0.95)', opacity: 0.4 },
        },
        'gradient-pulse': {
          '0%': { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0.25 },
          '50%': { transform: 'translate(-45%, -48%) scale(1.05)', opacity: 0.5 },
          '100%': { transform: 'translate(-52%, -54%) scale(0.92)', opacity: 0.3 },
        },
        'pulse': {
          '50%': {
            opacity: '.5'
          }
        }
      },
    },
  },
  plugins: [],
}

