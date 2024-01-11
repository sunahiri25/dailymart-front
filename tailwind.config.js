/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F93F4A',
      },
      boxShadow: {
        '3xl': '0 0 100px 100px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
