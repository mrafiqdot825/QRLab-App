/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Scheme-aware tokens — actual values live as CSS vars in src/global.css
        background: "rgb(var(--color-background) / <alpha-value>)",
        "bg-secondary": "rgb(var(--color-bg-secondary) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "glass-surface": "var(--glass-bg)",
        border: "var(--glass-border)",

        // Morrow Design Tokens
        "bg-canvas": "#FBEDE6",
        "bg-surface": "#FDF6F2",
        "bg-card": "#FFFFFF",
        ink: "#1A1416",
        "ink-muted": "#6B6468",
        plum: "#4A0F3A",
        "plum-light": "#6A1B54",
        "plum-subtle": "rgba(74, 15, 58, 0.08)",
        sage: "#C9D8BE",
        butter: "#FBE9A8",
        peach: "#F7B9A5",
        lavender: "#D9D4F5",
        periwinkle: "#AFC0F5",
        leaf: "#8FA67F",

        // Primary / Accent mappings to Plum
        primary: "#4A0F3A",
        "on-primary": "#FFFFFF",
        "primary-container": "rgb(var(--color-primary-container) / <alpha-value>)",
        secondary: "#6B6468",
        "on-secondary": "#FFFFFF",
        "secondary-container": "rgb(var(--color-secondary-container) / <alpha-value>)",
        tertiary: "#C9D8BE",
        "on-tertiary": "#1A1416",
        "tertiary-container": "rgb(var(--color-tertiary-container) / <alpha-value>)",
        accent: "#4A0F3A",
        orange: "#ED6C02",
        gold: "#FBE9A8",
        "surface-low": "rgb(var(--color-surface-low) / <alpha-value>)",
        "surface-high": "rgb(var(--color-surface-high) / <alpha-value>)",
        "surface-highest": "rgb(var(--color-surface-highest) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        error: "#D32F2F",
        "on-error": "#FFFFFF",
        success: "#8FA67F",
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "sans-serif"],
        display: ["Newsreader", "Georgia", "serif"],
        serif: ["Newsreader", "Georgia", "serif"],
      },
      borderRadius: {
        "3xl": "20px",
        "4xl": "24px",
        "5xl": "28px",
      },
      boxShadow: {
        'glass': '0 4px 16px rgba(74, 15, 58, 0.05)',
        'glass-hover': '0 6px 20px rgba(74, 15, 58, 0.08)',
        'hero': '0 8px 24px rgba(74, 15, 58, 0.06)',
        'card': '0 8px 24px rgba(74, 15, 58, 0.05)',
      }
    },
  },
  plugins: [],
};


