/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          // Define colors for dark mode
          dark: {
            TEXT: "#F7EFED",
            BG: '#0A0605',
            PRIMARY: "#DBA695",
            SECONDARY: "#7A3724",
            ACCENT: "#CD5837",
            CARD: "#120E0D",
            CARD1:"#1e1b1b",
            TABLE: "#333333"
         },
        // Define colors for light mode
        light: {
          TEXT: "#120A08",
          BG: '#faf6f5',
          PRIMARY: "#6A3624",
          SECONDARY: "#DB9885",
          ACCENT: "#C85232",
          CARD: "#f2eeed",
          CARD1: "#d1cecd",
          TABLE: "#9e9c9b"
        },

    },
  },
},
  plugins: [],
}

