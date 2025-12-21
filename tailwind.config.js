/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: ["selector", ".dark-theme"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F1FF",
          100: "#B8D9FF",
          200: "#8AC0FF",
          300: "#51A2FF",
          400: "#2E8FFF",
          500: "#0077FF", // Tu color principal
          600: "#0062D1",
          700: "#004CA3",
          800: "#003775",
          900: "#002147",
          950: "#000C1A",
        },
        gray: {
          50: "#F3F2F1",
          100: "#DDDBD9",
          200: "#C8C4C1",
          300: "#B2ADA9",
          400: "#9D9690",
          500: "#877E78",
          600: "#79716B",
          700: "#56514D",
          800: "#3E3A37", // Color para Tarjetas/Paneles en oscuro
          900: "#262322", // Color de Fondo Principal en oscuro
          950: "#0E0D0C", // Color para bordes muy oscuros o Navbar
        },
      },
    },
  },
  plugins: [],
};
