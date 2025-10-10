/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0D0D0D',
        'brand-card': '#1A1A1A',
        'brand-primary': '#00A8FF',
        'brand-accent': '#FACC15',
      },
      animation: {
        aurora: 'aurora 30s linear infinite',
        // **NEW: Add the slide animation**
        slide: 'slide 40s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        // **NEW: Define the keyframes for the slide animation**
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};