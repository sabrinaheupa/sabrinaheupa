import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tk: {
          black: "#000000",
          ink: "#0A0A0A",
          graphite: "#1A1A1A",
          ash: "#2A2A2A",
          smoke: "#6E6E6E",
          bone: "#E8E4DC",
          paper: "#F5F2EC",
          accent: "#C9A961",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
