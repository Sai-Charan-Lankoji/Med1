/** @type {import('tailwindcss').Config} */
/** withMT = require("@material-tailwind/react/utils/withMT"); */
module.exports = {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
    require("tailwind-scrollbar")
  ],
  // withMT({
  //   content: "./pages/**/*.{js,ts,jsx,tsx}",
  //   theme: {
  //     extend: {},
  //   },
  //   plugins: [],
  // }),
}


