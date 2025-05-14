/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)"],
        secondary: ["var(--font-secondary)"],
      },
      colors: {
        secondary: {
          DEFAULT: "oklch(65.69% 0.15 78.19)",
          "50": "oklch(91.45% 0.023 78.19)",
          "100": "oklch(84% 0.053 78.19)",
          "200": "oklch(76.41% 0.089 78.19)",
          "300": "oklch(68.9% 0.128 78.19)",
          "400": "oklch(61.26% 0.165 78.19)",
          "500": "oklch(53.73% 0.192 78.19)",
          "600": "oklch(46.08% 0.213 78.19)",
          "700": "oklch(38.4% 0.211 78.19)",
          "800": "oklch(30.46% 0.192 78.19)",
          "900": "oklch(21.78% 0.151 78.19)",
          "950": "oklch(13.72% 0.074 78.19)"
        }
      },
      boxShadow: {
        card: "0 1px 3px oklch(0% 0 0 / 0.12), 0 1px 2px oklch(0% 0 0 / 0.08)"
      }
    }
  }
};
