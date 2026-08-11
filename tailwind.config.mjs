/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#9a659b',
          700: '#7d4f7e',
          dark: '#b989ba',
        },
        lime: {
          500: '#bcc65e',
        },
        aqua: {
          500: '#6bb29c',
        },
        primary: '#9a659b',
        secondary: {
          lime: '#bcc65e',
          teal: '#6bb29c',
        },
        paper: {
          DEFAULT: '#FFFEFB',
          surface: '#FFFFFF',
          photo: '#EFE9E1',
          hairline: '#E7DFD5',
          muted: '#6B6067',
          ink: '#2B2429',
        },
        night: {
          DEFAULT: '#1C171B',
          surface: '#241E23',
          hairline: '#3A3238',
          muted: '#A79CA3',
          ink: '#F2EDE8',
        },
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
