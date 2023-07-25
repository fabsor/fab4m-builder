/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "index.html",
    "../src/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../core/dist/index.es.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
