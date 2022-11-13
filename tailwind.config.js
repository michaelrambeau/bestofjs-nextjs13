/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const daisyUI = require("daisyui");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // to avoid a conflict between TailwindCSS and DaisyUI
        // https://github.com/saadeghi/daisyui/issues/683#issuecomment-1086754993
        neutral: colors.neutral,
      },
    },
  },
  plugins: [daisyUI, require("@headlessui/tailwindcss")],
};
