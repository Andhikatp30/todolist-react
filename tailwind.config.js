/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Pastikan jalur ini ada agar Tailwind bisa bekerja di komponen React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
