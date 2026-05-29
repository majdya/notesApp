/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        background: '#f5f5f5',
        primary: '#007AFF',
        danger: '#ff4444',
        text: {
          primary: '#1a1a1a',
          secondary: '#666666',
          tertiary: '#999999',
        },
        border: '#e0e0e0',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        button: '10px',
        fab: '28px',
      },
    },
  },
  plugins: [],
};
