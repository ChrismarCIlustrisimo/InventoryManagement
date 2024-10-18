/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define colors for light mode
        light: {
          primary: "#E84C19", // ACCENT
          activeLink: "#FCF1ED",
          bg: "#F9FAFB", //BG
          container: "#FFFFFF", //CARD
          textPrimary: "#333333", // TEXT
          textSecondary: "#6B7280", // SECONDARY
          border: "#E5E7EB",  // TABLE
          accent1: "#4FD1C5",   // Soft Teal
          accent2: "#F4A261",   // Warm Beige
          accent3: "#CBD5E0",   // Cool Gray
          hover: "#FF6F41",
          disabled: "#D1D5DB",
          button: "#007BFF",
          backgroundPrimary: "#FDD3D0",
        },
        // Define colors for dark mode
        dark: {
          primary: "#FF6D3A", // ACCENT
          activeLink: "#FFD8CC",
          bg:"#121212", //BG
          container: "#1E1E1E", //CARD
          textPrimary: "#E5E7EB", // TEXT
          textSecondary: "#A1A1AA", // SECONDARY
          border: "#2C2C2E", // TABLE
          accent1: "#2B6CB0",   // Deep Blue
          accent2: "#D69E2E",   // Muted Gold
          accent3: "#2F855A",   // Forest Green
          hover: "#FF8A66",
          disabled: "#6B7280",
        },
      },
    },
  },
  plugins: [],
}
