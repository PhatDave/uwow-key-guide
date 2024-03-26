const defaultTheme = require('tailwindcss/defaultTheme');
const heropatterns = require('tailwindcss-hero-patterns/src/patterns');

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['roboto', ...defaultTheme.fontFamily.sans]
      }
    },
    heroPatternsOpacities: ['5'],
    heroPatterns: {
      topography: heropatterns.topography
    }
  },

  daisyui: {
    themes: ['black', 'light']
  },
  plugins: [require('daisyui'), require('tailwindcss-hero-patterns')]
};

module.exports = config;
