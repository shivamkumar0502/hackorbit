/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      animation: {
        "spin-slow": "spin 40s linear infinite",
        "spin-medium": "spin 60s linear infinite",
        "spin-slower": "spin 80s linear infinite",
      }

    },
  },
  plugins: [],
}