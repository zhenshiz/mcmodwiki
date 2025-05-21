/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'dark-blue': '#032742',
        'light-blue': '#e4f9ff',
        'black-blue':'#001f2e',
        'hover-light-blue': '#b2e2fb',
        'hover-dark-blue': '#0b3761',
        'hover-light-pink': '#ffebf5',
        'hover-dark-pink': '#5c4660',
        'light-line-between':'#cbccca',
        'dark-line-between':'#3a5569',
        'text-blue':'#00c0f5',
        'text-pink':'#f35fab',
        'text-gray': '#999'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ]
}

