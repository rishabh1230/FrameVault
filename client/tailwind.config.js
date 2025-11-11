/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cinema': {
          'bg': '#121212',
          'card': '#1E1E1E',
          'text-primary': '#E0E0E0',
          'text-secondary': '#A0A0A0',
          'accent': '#B22222',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};
