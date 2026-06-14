/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        workspace: {
          bg: "#0B0F19",
          panel: "#131C2E",
          border: "#1E293B",
          accent: "#38BDF8",
          darkAccent: "#0369A1",
          textActive: "#F8FAFC",
          textMuted: "#94A3B8",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
}