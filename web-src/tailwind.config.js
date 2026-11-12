/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', '"Traditional Arabic"', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)', container: 'var(--color-primary-container)',
          gold: 'var(--color-accent)', goldink: 'var(--color-accent-ink)', goldsoft: 'var(--color-accent-container)',
          ink: 'var(--color-text-primary)', ink2: 'var(--color-text-secondary)', mute: 'var(--color-text-muted)',
          bg: 'var(--color-bg)', surface: 'var(--color-surface)', raised: 'var(--color-surface-raised)', cream: 'var(--color-cream)',
          line: 'var(--color-border)', line2: 'var(--color-border-strong)',
          night: 'var(--color-night)', night2: 'var(--color-night-2)', night3: 'var(--color-night-3)',
          ondark: 'var(--color-on-dark)', ondark2: 'var(--color-on-dark-muted)', ondark3: 'var(--color-on-dark-faint)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  plugins: [require("tailwindcss-animate")],
}
