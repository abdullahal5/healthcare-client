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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      colors: {
        background: {
          DEFAULT: "#ffffff",
          dark: "#1c1c1c",
        },
        foreground: {
          DEFAULT: "#0B1134CC",
          dark: "#EDEDED",
        },
        primary: {
          DEFAULT: "#1586FD",
          dark: "#0D6EFD",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#666f73",
          dark: "#3a3a3a",
          light: "#f8f8f8",
          foreground: "#0f172a",
        },
        destructive: {
          DEFAULT: "#ef4444",
          dark: "#dc2626",
          foreground: "#ffffff",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#4b5563",
        },
        input: {
          DEFAULT: "#e5e7eb",
          dark: "#374151",
        },
        ring: {
          DEFAULT: "#1586FD",
          dark: "#0D6EFD",
        },
      },
      boxShadow: {
        custom: "0px 5px 22px rgba(211, 211, 211, 0.5)",
        dark: "0px 5px 22px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
