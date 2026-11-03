/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fbf7ee',
          100: '#f5edd6',
          200: '#edd9aa',
          300: '#e3be75',
          400: '#d9a345',
          500: '#ca8a24',
          600: '#b06f1b',
          700: '#8c5118',
          800: '#72421a',
          900: '#5f3719',
        },
        library: {
          bg: '#faf8f5',
          darkBg: '#0f172a',
          card: '#ffffff',
          darkCard: '#1e293b',
          accent: '#10b981',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      }
    },
  },
  plugins: [],
}

