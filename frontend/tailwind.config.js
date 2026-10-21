/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0b0f17',
          800: '#111827',
          700: '#1b2333',
          600: '#253248'
        },
        accent: {
          teal: '#00f2fe',
          cyan: '#4facfe',
          emerald: '#10b981',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      boxShadow: {
        '3d-sm': '0 10px 20px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        '3d-card': '0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 8px 12px -4px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        '3d-hover': '0 25px 40px -12px rgba(0, 0, 0, 0.6), 0 12px 16px -6px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        'glow-teal': '0 0 25px rgba(0, 242, 254, 0.35)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.35)',
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
