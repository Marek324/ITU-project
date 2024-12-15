import React from "react";
import PowerupCount from "./PowerupCount";

const PowerupButton = ({ onClickHandler, svg, powerupName, count }) => {
	const abbrTitles = {
		undo: "Undo the last move",
		delete: "Delete a tile",
		swap: "Swap two tiles",
		deletenum: "Delete all tiles with a certain number"
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
