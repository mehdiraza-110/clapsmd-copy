/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#94d12c', // Logo Green
          dark: '#7ab122',
          light: '#aae056',
          darker: '#5a8219',
        },
        secondary: {
          DEFAULT: '#003d5b', // Logo Blue
          dark: '#002a3f',
          light: '#00547d',
        }
      },
    },
  },
  plugins: [],
};
