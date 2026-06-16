export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8f2',
          100: '#d7efdf',
          200: '#bed9c7',
          500: '#2f7d4f',
          600: '#276643',
          700: '#1d4c32',
          900: '#0f281b',
        },
        accent: '#c96f31',
        sand: '#f5efe4',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(30, 58, 44, 0.12)',
      },
    },
  },
  plugins: [],
};
