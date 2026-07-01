/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: '#f9f9f9',
        foreground: '#1a1c1c',
        primary: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#006875',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ba1a1a',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f3f3f4',
          foreground: '#4c4546',
        },
        accent: {
          DEFAULT: '#00e3fd',
          foreground: '#00616d',
        },
        border: '#000000',
        input: '#000000',
        ring: '#000000',
      },
      borderWidth: {
        DEFAULT: '4px',
        '2': '2px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'brutalist': '6px 6px 0px 0px rgba(0,0,0,1)',
        'brutalist-cyan': '6px 6px 0px 0px #00E5FF',
        'brutalist-red': '6px 6px 0px 0px #FF4D4D',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px', // for very specific things like circles if needed, though system says sharp
      }
    },
  },
  plugins: [],
}
