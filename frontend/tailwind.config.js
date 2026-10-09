/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dagno: {
          blue: "#0B5FFF",
          blueDark: "#0847C4",
          blueLight: "#E8F0FF",
          ink: "#1A1D23",
          inkSoft: "#4B5563",
          bg: "#FAFAF8",
          border: "#E5E7EB",
          success: "#0E9F6E",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
      },
      fontFamily: {
        display: ['"Sora"', "system-ui", "sans-serif"],
        body: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26, 29, 35, 0.04), 0 4px 12px rgba(26, 29, 35, 0.05)",
        header: "0 1px 0 rgba(26, 29, 35, 0.06)",
      },
    },
  },
  plugins: [],
};