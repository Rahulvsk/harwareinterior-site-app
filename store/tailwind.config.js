/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Open Sans", "sans-serif"],
      serif: ["Inter", "sans-serif"],
      DejaVu: ["DejaVu Sans", "Arial", "sans-serif"],
    },
    extend: {


 colors: {
        gray: {
          50: "oklch(98.5% 0.002 247.839)",
          100: "oklch(96.7% 0.003 264.542)",
          200: "oklch(92.8% 0.006 264.531)",
          300: "oklch(87.2% 0.01 258.338)",
          400: "oklch(70.7% 0.022 261.325)",
          500: "oklch(55.1% 0.027 264.364)",
          600: "oklch(89.075% 0.00474 258.605)",
          700: "oklch(99.031% 0.0011 202.799)",
          800: "oklch(99.107% 0.00011 271.152)",
          900: "oklch(21% 0.034 264.665)",
          950: "oklch(13% 0.028 261.692)",
        },
        zinc: {
          600: "oklch(44.2% 0.017 285.786)",
          700: "oklch(37% 0.013 285.805)",
          800: "oklch(27.4% 0.006 286.033)",
        },
        slate: {
          900: "oklch(20.8% 0.042 265.755)",
        },
      },






      height: {
        header: "560px",
      },
      backgroundImage: {
        "page-header": "url('/page-header-bg.jpg')",
        "contact-header": "url('/page-header-bg-2.jpg')",
        subscribe: "url('/subscribe-bg.jpg')",
        "app-download": "url('/app-download.jpg')",
        cta: "url('/cta-bg.png')",
        "cta-1": "url('/cta/cta-bg-1.png')",
        "cta-2": "url('/cta/cta-bg-2.png')",
        "cta-3": "url('/cta/cta-bg-3.png')",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

module.exports = config;
