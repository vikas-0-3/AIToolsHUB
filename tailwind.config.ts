import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#090d18", paper: "#090d18", brand: "#9b8cff", pink: "#f472b6", lemon: "#fcd34d", mint: "#6ee7b7", tangerine: "#fb923c", lilac: "#c4b5fd",
      slate: { 500: "#8a93b2", 600: "#aab2cf" }, blue: { 50: "rgba(139,124,255,.14)" } },
    borderColor: { DEFAULT: "rgba(255,255,255,.1)" }, borderWidth: { DEFAULT: "1px" },
    boxShadow: { pop: "0 10px 40px rgba(0,0,0,.35)" },
    fontFamily: { display: ["var(--font-display)", "system-ui", "sans-serif"], sans: ["var(--font-body)", "system-ui", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
