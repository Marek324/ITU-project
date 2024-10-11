/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
		colors: {
			Pet_Header_BG: '#5994CE',
			Pet_Text: '#B957CE',
			Pet_UI_Icon: '#B9E9E9',
			Pet_BG: '#2A2356'
		}
	},
	  fontFamily: {
		'Pet_Title': ['Press Start 2P', 'sans-serif'],
	  }
  },
  plugins: [
	  require('daisyui'),
	  require('react-custom-scrollbars-2')
  ],
}

