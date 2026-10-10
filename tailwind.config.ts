import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        nature: {
          50: "#f4f7f4",
          100: "#e5ece4",
          200: "#cddbcd",
          300: "#a6c1a6",
          400: "#7aa17a",
          500: "#598359",
          600: "#446744",
          700: "#365236",
          800: "#2d422d",
          900: "#273827",
          950: "#131e13",
        },
        forest: {
          DEFAULT: "#1f3b2b",
          dark: "#14271c",
          light: "#2d543e",
        },
        earth: {
          50: "#faf6f0",
          100: "#f3ece0",
          200: "#e6d7bf",
          300: "#d6be99",
          400: "#c4a373",
          500: "#a9834d",
          600: "#8c663c",
          700: "#704f32",
          800: "#5d412d",
          900: "#4f3728",
        },
        sage: {
          DEFAULT: "#8fa382",
          light: "#b4c5ab",
          dark: "#6c8060",
        },
        cream: {
          DEFAULT: "#fdfbf7",
          warm: "#f7f4ee",
          card: "#ffffff",
        },
        sky: {
          soft: "#e3f0f7",
          accent: "#3882a5",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
      },
      boxShadow: {
        nature: "0 4px 20px -2px rgba(31, 59, 43, 0.08)",
        "nature-lg": "0 10px 30px -4px rgba(31, 59, 43, 0.12)",
        "nature-card": "0 2px 12px rgba(27, 48, 35, 0.05)",
      },
      keyframes: {
        pulseLeaf: {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.05) rotate(3deg)" },
        },
        floatGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "leaf-pulse": "pulseLeaf 3s ease-in-out infinite",
        "float-gentle": "floatGentle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
