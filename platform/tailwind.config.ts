import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:    '#1a1a1a',
        paper:  '#ffffff',
        accent: '#c9a84c',
        'accent-light': '#d4b968',
        mute:   '#8a8578',
        line:   '#e8e3da',
      },
      fontFamily: {
        serif:  ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:   ['var(--font-ibm)', 'IBM Plex Sans Arabic', 'Inter', 'Arial', 'sans-serif'],
        inter:  ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
