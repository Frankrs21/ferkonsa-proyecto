/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"]
      },
      colors: {
        primary: "#ff0400",
        grayText: "#b5b5b5"
      }
    }
  },
  plugins: []
};
