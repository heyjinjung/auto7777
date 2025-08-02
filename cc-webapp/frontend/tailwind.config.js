module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF007A', // Example primary color
        secondary: '#00CFFF', // Example secondary color
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'pink-gradient': ['#FF007A', '#FF6F00'],
      }),
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}