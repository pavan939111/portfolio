import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          green: 'var(--accent-green)',
        }
      },
      fontFamily: {
        headings: ['var(--font-headings)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'marquee-left': 'marqueeLeft 25s linear infinite',
        'marquee-right': 'marqueeRight 25s linear infinite',
        'soundwave': 'soundwave 1.2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} satisfies Config
