/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        diner: {
          bg: "#0f1133",
          panel: "#1a1f4d",
          accent: "#ff7eb3",
          warm: "#ffd166",
          good: "#06d6a0",
          bad: "#ef476f",
          mid: "#118ab2",
        },
      },
      fontFamily: {
        display: ["'Press Start 2P'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
