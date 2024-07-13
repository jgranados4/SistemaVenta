/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    colors: {
      blueC: "#1d4ed8",
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
