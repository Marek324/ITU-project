import React from "react";

const RestartButton = ({ onClickHandler }) => {
	return (
		<button
			className={`
				px-4 py-2
				w-32
				rounded-lg
				shadow-md
				transition-colors duration-300
				hover:bg-gray-600
				hover:shadow-2xl
			`}
			onClick={() => {onClickHandler()}}
		>
			{"Play Again"}
		</button>
	);
}

export default RestartButton;
