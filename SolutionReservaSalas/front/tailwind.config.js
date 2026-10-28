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
      keyframes: {
        flutuar: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(3rem, -2rem) scale(1.1)" },
        },
      },
      animation: {
        flutuar: "flutuar 18s ease-in-out infinite",
        "flutuar-lento": "flutuar 26s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [],
}
