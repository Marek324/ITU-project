/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}",
	],
	safelist: [
		'translate-x-m0',
		'translate-x-m1',
		'translate-x-m2',
		'translate-x-m3',
		'translate-y-m0',
		'translate-y-m1',
		'translate-y-m2',
		'translate-y-m3',
		'-translate-x-m0',
		'-translate-x-m1',
		'-translate-x-m2',
		'-translate-x-m3',
		'-translate-y-m0',
		'-translate-y-m1',
		'-translate-y-m2',
		'-translate-y-m3',
		'top-m0',
		'top-m1',
		'top-m2',
		'top-m3',
		'left-m0',
		'left-m1',
		'left-m2',
		'left-m3'
	],
	theme: {
	  extend: {
		  width: {
			  'list-img': '12rem', // Custom width for images
			  'main-img': '25rem'
		  },
		  height: {
			  'list-img': '12rem',
			  'main-img': '25rem'// Custom height for images
		  },
		  colors: {
				Pet_Header_BG: '#5994CE',
				Pet_Text: '#B957CE',
				Pet_UI_Icon: '#B9E9E9',
				Pet_BG: '#2A2356',
				Main_Header: '#7183C0',
				Main_Header_Border: '#963FB4',
				Animal_Card_BG: '#34495E',
				Main_BG: '#FBF7FF',
				Tile_1: '#E5F4E3',
				Tile_2: '#FFFDD0',
				Tile_3: '#9CAF88',
				Tile_4: '#CCCCFF',
				Tile_5: '#FFDB58',
				Tile_6: '#8E4585',
				Tile_7: '#48ACF0',
				Tile_8: '#FF5349',
		  },
		  spacing: {
			'm0': '0rem',
			'm1': '8.5rem',
			'm2': '17rem',
			'm3': '25.5rem',
		  }
	  },
		fontFamily: {
		  Pet_Title: ['"Press Start 2P"', 'sans-serif'],
			Header_Text: ['"Press Start 2P"', 'sans-serif'],
		},


	},
	plugins: [
		require('daisyui'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/aspect-ratio'),
		require('react-custom-scrollbars-2')

	],
  }

