/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Devotional palette
        saffron: {
          DEFAULT: "var(--saffron)",
          50: "oklch(0.97 0.04 60)",
          100: "oklch(0.93 0.08 60)",
          200: "oklch(0.87 0.12 58)",
          300: "oklch(0.80 0.16 56)",
          400: "oklch(0.75 0.18 54)",
          500: "oklch(0.68 0.20 52)",
          600: "oklch(0.62 0.18 48)",
          700: "oklch(0.55 0.16 44)",
          800: "oklch(0.45 0.13 38)",
          900: "oklch(0.35 0.10 30)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          50: "oklch(0.97 0.04 85)",
          100: "oklch(0.94 0.08 83)",
          200: "oklch(0.90 0.12 82)",
          300: "oklch(0.87 0.15 81)",
          400: "oklch(0.84 0.17 80)",
          500: "oklch(0.80 0.18 79)",
          600: "oklch(0.75 0.17 77)",
          700: "oklch(0.68 0.15 74)",
          800: "oklch(0.58 0.12 70)",
          900: "oklch(0.45 0.09 65)",
        },
        maroon: {
          DEFAULT: "var(--maroon)",
          50: "oklch(0.95 0.03 20)",
          100: "oklch(0.88 0.06 20)",
          200: "oklch(0.78 0.09 20)",
          300: "oklch(0.65 0.11 20)",
          400: "oklch(0.52 0.13 20)",
          500: "oklch(0.42 0.14 20)",
          600: "oklch(0.35 0.14 20)",
          700: "oklch(0.28 0.12 18)",
          800: "oklch(0.22 0.10 16)",
          900: "oklch(0.16 0.07 14)",
        },
        cream: {
          DEFAULT: "var(--cream)",
          50: "oklch(0.99 0.01 85)",
          100: "oklch(0.97 0.025 85)",
          200: "oklch(0.94 0.04 82)",
          300: "oklch(0.90 0.06 80)",
          400: "oklch(0.85 0.08 78)",
        },
      },
      fontFamily: {
        heading: ["'Yatra One'", "'Tiro Devanagari Hindi'", "serif"],
        devanagari: ["'Tiro Devanagari Hindi'", "serif"],
        body: ["'Poppins'", "sans-serif"],
        sans: ["'Poppins'", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "gold": "0 0 15px oklch(0.82 0.18 80 / 0.4), 0 0 30px oklch(0.72 0.19 55 / 0.2)",
        "gold-lg": "0 0 30px oklch(0.82 0.18 80 / 0.6), 0 0 60px oklch(0.72 0.19 55 / 0.3)",
        "saffron": "0 4px 20px oklch(0.62 0.18 45 / 0.3)",
        "maroon": "0 4px 20px oklch(0.35 0.14 20 / 0.3)",
        "divine": "0 0 40px oklch(0.82 0.18 80 / 0.5), 0 0 80px oklch(0.72 0.19 55 / 0.3), inset 0 0 40px oklch(0.82 0.18 80 / 0.1)",
      },
      backgroundImage: {
        "mandala-pattern": "url('/assets/generated/mandala-bg-tile.dim_512x512.png')",
        "devotional-gradient": "linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.55 0.18 45), oklch(0.35 0.14 20))",
        "gold-gradient": "linear-gradient(135deg, oklch(0.82 0.18 80), oklch(0.72 0.19 55))",
        "saffron-gradient": "linear-gradient(135deg, oklch(0.72 0.19 55), oklch(0.62 0.18 45))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
