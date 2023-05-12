/** @type {import('tailwindcss').Config} */
module.exports = {
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
