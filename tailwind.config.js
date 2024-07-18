/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    colors: {
      blue_500: "#3b82f6",
      blueS: "#1d4ed8",
      bluePastel: "#70d6ff",
      gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
        950: "#030712",
      },
      indigo_50: "rgb(var(--color-indigo-50) / <alpha-value>)",
      indigo: "rgb(var(--color-indigo-500) / <alpha-value>)",
      indigo_v: "rgb(var(--color-indigo-600) / <alpha-value>)",
      black: "#020617",
      white: "#ffffff",
    },
    extend: {},
  },
};
