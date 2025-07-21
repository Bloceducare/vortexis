import type { Config } from "tailwindcss";
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#009aff",
        "primary-foreground": "#ffffff",
        secondary: "#425583",
        "muted-foreground": "#6b7280", // gray-500
        card: "#ffffff", // or a light gray if you want variation
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #009aff, #00c2ff)",
        "gradient-subtle": "linear-gradient(to bottom, #f8f9fc, #e2e8f0)",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

