/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#161b27',
        panel:   '#1e2638',
        border:  '#2a3349',
        muted:   '#8892a4',
        accent:  '#6366f1',
        'accent-hover': '#4f46e5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
