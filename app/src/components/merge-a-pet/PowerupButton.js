import React from "react";
import PowerupCount from "./PowerupCount";

const PowerupButton = ({ onClickHandler, svg, count }) => {
	return (
		<div
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
					hover:bg-gray-700
					flex items-center justify-center
				`}
				onClick={() => {onClickHandler()}}
			>
				{svg()}
			</button>
			<PowerupCount count={count} />
		</div>
	);
}

export default PowerupButton;
