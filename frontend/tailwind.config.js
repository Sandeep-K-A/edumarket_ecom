/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E7490",
          dark: "#155E75", // for hover states — one shade darker
        },
        secondary: "#64748B",
        tertiary: "#F8FAFC",
        neutral: "#1E293B",
      },
    },
  },
  plugins: [],
};
