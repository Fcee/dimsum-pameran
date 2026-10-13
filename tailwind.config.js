/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 3 Base Colors as requested:
        // 1. Coral Dimsum (Primary)
        coral: {
          50: '#FFF2F0',
          100: '#FFE2DE',
          200: '#FFC8BF',
          300: '#FFA494',
          400: '#FF816B',
          500: '#FF6B6B', // Main Coral
          600: '#E65050',
          700: '#C23838',
          800: '#9E2727',
          900: '#7E1C1C',
        },
        // 2. Steamer Cream (Secondary/Base)
        cream: {
          50: '#FFFDF9',
          100: '#FFF9F0', // Main Canvas Cream
          200: '#FFF2E0',
          300: '#FFE4C4',
          400: '#FED7AA',
          500: '#FDBA74',
        },
        // 3. Scallion Jade (Accent)
        scallion: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#2E8B57', // Main Scallion
          600: '#237346',
          700: '#1B5B37',
          800: '#14462B',
        },
        // Neutral Ink for readable typography
        ink: {
          900: '#231815',
          800: '#3D2F2C',
          700: '#5A4A46',
          600: '#786662',
          500: '#9C8884',
          400: '#BEADA9',
          300: '#DDD2CE',
          200: '#EFE8E5',
          100: '#F9F5F3',
        }
      },
      fontFamily: {
        bubble: ['Fredoka', 'sans-serif'],
      },
      boxShadow: {
        'bubbly': '0 8px 0 0 rgba(0, 0, 0, 0.08)',
        'bubbly-coral': '0 6px 0 0 #E65050',
        'bubbly-scallion': '0 6px 0 0 #1B5B37',
        'card-soft': '0 10px 25px -5px rgba(230, 80, 80, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'bubble': '1.5rem',
        'bubble-lg': '2rem',
        'bubble-xl': '2.5rem',
      }
    },
  },
  plugins: [],
}

