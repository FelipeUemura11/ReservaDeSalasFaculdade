/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Cores definidas em src/index.css (:root)
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        third: "var(--third)",
      },
    },
  },
  plugins: [],
}
