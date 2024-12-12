import React from "react";
import PowerupCount from "./PowerupCount";

const PowerupButton = ({ onClickHandler, svg, powerupName, count }) => {
	const abbrTitles = {
		undo: "Undo the last move\nMake a 128 tile to get more uses",
		delete: "Delete a tile\nMake a 256 tile to get more uses",
		swap: "Swap two tiles\nMake a 512 tile to get more uses",
		deletenum: "Delete all tiles with a certain number\nMake a 1024 tile to get more uses"
	};

	return (
		<abbr
			title={abbrTitles[powerupName]}
			className={`
				flex flex-col items-center
				p-1
				w-20 h-20
			`}
		>
			<button
				className={`
					text-white
					font-bold text-lg
					rounded-lg
					w-16 h-16
					mb-3
					transition-all duration-300
					shadow-lg
					hover:shadow-2xl
					hover:bg-gray-600
					flex items-center justify-center
				`}
				onClick={() => {onClickHandler()}}
			>
				{svg()}
			</button>
			<PowerupCount count={count} />
		</abbr>
	);
}

export default PowerupButton;
