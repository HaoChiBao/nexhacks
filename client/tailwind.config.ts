import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10b981", // Emerald 500
          hover: "#059669", // Emerald 600
          glow: "rgba(16, 185, 129, 0.4)",
        },
        background: {
          dark: "#0B0C0E",
          light: "#F3F4F6",
        },
        surface: {
          dark: "#14161A",
          hover: "#1A1D23",
          light: "#FFFFFF",
        },
        border: {
          dark: "#27272A",
        },
        text: {
          main: "#FFFFFF",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      backgroundImage: {
        "green-gradient": "linear-gradient(135deg, #10b981 0%, #047857 100%)",
        "card-gradient-dark":
          "linear-gradient(180deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0) 100%)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scroll-up": "scroll-up 60s linear infinite",
      },
      keyframes: {
        "scroll-up": {
            "0%": { transform: "translateY(0)" },
            "100%": { transform: "translateY(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
