/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['"Orbitron"', 'sans-serif'],
        'rajdhani': ['"Rajdhani"', 'sans-serif'],
      },
      colors: {
        'electric-blue': '#00ccff',
        'dark-blue': '#0066cc',
        'neon-blue': '#00c3ff',
        'neon-purple': '#bc13fe',
        'dark-bg': '#121212',
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00c3ff, 0 0 10px #00c3ff, 0 0 15px #00c3ff',
        'neon-purple': '0 0 5px #bc13fe, 0 0 10px #bc13fe, 0 0 15px #bc13fe',
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00c3ff, 0 0 10px #00c3ff' },
          '100%': { boxShadow: '0 0 10px #00c3ff, 0 0 20px #00c3ff, 0 0 30px #00c3ff' },
        },
      },
    },
  },
  plugins: [],
} 