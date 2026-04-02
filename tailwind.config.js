/** @type {import('tailwindcss').Config} */
const color = require("./src/theme/color");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...color.colorTokens,
        primary: {
          ...color.colorTokens.primary,
          main: "var(--primary-main)",
        },
        background: {
          ...color.colorTokens.background,
          default: "var(--background-default)",
          paper: "var(--background-paper)",
        },
        text: {
          ...color.colorTokens.text,
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
      },
      fontFamily: {
        "belle-aurore": ['"La Belle Aurore"', "cursive"],
        poppins: ["Poppins", "sans-serif"],
      },
      clipPath: {
        diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      },
      rotate: {
        45: "45deg",
        "-45": "-45deg",
      },
    },
  },
  plugins: [require("tailwind-clip-path")],
};
