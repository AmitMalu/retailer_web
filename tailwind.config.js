/** @type {import('tailwindcss').Config} */
const color = require("./src/theme/color");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...color.colorTokens,
      },
      fontFamily: {
        "belle-aurore": ['"La Belle Aurore"', "cursive"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
