import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f97316",
          orangeDark: "#ea580c",
          ink: "#111827",
          muted: "#64748b",
          line: "#e5e7eb",
          soft: "#fff7ed"
        }
      },
      boxShadow: {
        premium: "0 24px 70px rgba(15, 23, 42, 0.09)",
        card: "0 12px 30px rgba(15, 23, 42, 0.06)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 420ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
