/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      public: "var(--font-public-sans)",
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      animation: {
        "ping-call":
          "ping_call 3s cubic-bezier(0.21, 0.98, 0.6, 0.99) 2.5s infinite",
        "zoom-calling": "zoom_calling 3s ease-out 1s infinite",
        "ring-calling": "ring_call 1s ease-in-out .5s infinite",
      },
      keyframes: {
        ping_call: {
          "0%": { opacity: "1" },
          "50%, 100%": { scale: "1.5", opacity: "0" },
        },
        zoom_calling: {
          "0%": { scale: "1" },
          "40%": { scale: "1.15" },
          "60%, 100%": { scale: "1" },
        },
        ring_call: {
          "0%, 100%": {
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
            rotate: "10deg",
            scale: "1",
          },
          "60%": {
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
            rotate: "-10deg",
            scale: "1.05",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
