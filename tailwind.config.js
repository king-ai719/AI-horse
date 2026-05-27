/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        race: {
          red: "#FF2D2D",
          gold: "#FFB800",
          cyan: "#00E5FF",
          dark: "#080B12",
          card: "#0D1320",
          border: "#1A2540",
        },
      },
      fontFamily: {
        display: ["'Orbitron'", "monospace"],
        body: ["'Noto Sans JP'", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan": "scan 2s linear infinite",
        "flicker": "flicker 0.15s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
