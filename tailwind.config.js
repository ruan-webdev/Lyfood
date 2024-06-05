/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        home: "url('/assets/bg.png')",
      },
    },
  },
  plugins: [],
}
