/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Be Vietnam Pro', 'sans-serif'],
      },
      colors: {
        brand: {
          forest: '#1B4332',
          leaf: '#2D6A4F',
          mint: '#52B788',
          sand: '#EDEAE3',
          slate: '#2D3748',
          success: '#38A169',
          warning: '#DD6B20',
          error: '#E53E3E',
        }
      }
    },
  },
  plugins: [],
}
