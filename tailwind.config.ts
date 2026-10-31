import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f14",
        surface: "#1a1a22",
        text: "#f5f5f7",
        primary: "#ff3d71",
        error: "#ff5252",
        success: "#2ecc71",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "12px",
        field: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
