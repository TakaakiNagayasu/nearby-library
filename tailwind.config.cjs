/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend:{
      colors:{
        main: "#8F8B8A",
        sub: "#B0CAB4",
        accent: "#E5E2DE",
        text: "#000000",
        warning: "#D9C89E",
        error: "#C75C5C",
        errorMessage: "#912F2F",
      },
    },
  },
  plugins: [],
};
