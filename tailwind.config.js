/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFDF7',
        'canvas-alt': '#FAF9F5',
        sunshine: {
          DEFAULT: '#FFD54F',
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FFD54F',
          600: '#FFCA28',
          700: '#FFC107',
        },
        butter: {
          DEFAULT: '#FFE8A1',
          light: '#FFF7D1',
          hover: '#FFDF80',
        },
        cream: {
          DEFAULT: '#FFF7E1',
          light: '#FFFBF2',
        },
        peach: {
          DEFAULT: '#FFB366',
          50: '#FFF3E8',
          100: '#FFE2CC',
          200: '#FFC899',
          500: '#FFB366',
          600: '#F97316',
        },
        sunlit: {
          DEFAULT: '#A3B454',
          text: '#4D5B18',
          light: '#F4F7E6',
          border: '#C7D487',
        },
        espresso: {
          DEFAULT: '#1C1917',
          light: '#292524',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px rgba(28, 25, 23, 0.04), 0 1px 3px rgba(255, 213, 79, 0.08)',
        'warm': '0 4px 6px -1px rgba(28, 25, 23, 0.05), 0 2px 4px -2px rgba(255, 213, 79, 0.1)',
        'warm-lg': '0 10px 15px -3px rgba(28, 25, 23, 0.06), 0 4px 6px -4px rgba(255, 213, 79, 0.12)',
        'warm-xl': '0 20px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(255, 213, 79, 0.15)',
      }
    },
  },
  plugins: [],
}
