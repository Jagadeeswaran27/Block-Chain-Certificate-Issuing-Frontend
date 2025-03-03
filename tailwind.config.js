/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#e6f0ff",
          100: "#cce0ff",
          200: "#99c2ff",
          300: "#66a3ff",
          400: "#3385ff",
          500: "#0066ff", // main primary color
          600: "#0052cc",
          700: "#003d99",
          800: "#002966",
          900: "#001433",
        },
        secondary: {
          50: "#fff8e6",
          100: "#fff1cc",
          200: "#ffe499",
          300: "#ffd666",
          400: "#ffc933",
          500: "#ffbb00", // accent color for certificates
          600: "#cc9600",
          700: "#997000",
          800: "#664b00",
          900: "#332500",
        },
        neutral: {
          750: "#2a3142", // dark background
          850: "#1a202c", // darker background
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
        },
        red: {
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
        },
        green: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        blue: {
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
        },
      },
    },
  },
  plugins: [],
};
