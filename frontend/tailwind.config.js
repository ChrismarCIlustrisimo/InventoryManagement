/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //colors use in project
      colors: {
        primary: "#cd5837",
        secondary: '#EF863E',
        primaryBackground:"#111e22",
        inputBgColor:"#1e1b1b",
        bgContainer:"#120e0d",
      },
      backgroundColor: {
        'primary-opacity': 'rgba(205, 88, 55, 0.75)', // Adjust opacity here
        'primary-active': 'rgba(205, 88, 55, 1)',    // Adjust active opacity here

      },
    },
  },
  plugins: [],
}

