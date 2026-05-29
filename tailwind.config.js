/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        background: '#f2f2f7',
        primary: '#00994E',
        primaryLight: '#e8f5e9',
        danger: '#ff3b30',
        text: {
          primary: '#1c1c1e',
          secondary: '#8e8e93',
          tertiary: '#aeaeb2',
        },
        border: '#d1d1d6',
      },
      borderRadius: {
        card: '10px',
        input: '8px',
        button: '10px',
        fab: '28px',
      },
    },
  },
  plugins: [],
};
