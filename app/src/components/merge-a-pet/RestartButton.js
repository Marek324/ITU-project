import React from "react";

const RestartButton = ({ onClickHandler, text }) => {
	return (
		<button
			className={`
				px-4 py-2
				bg-orange-200 text-white
				font-bold text-lg
				rounded-lg
				shadow-md
				transition-colors duration-300
				hover:bg-orange-500
			`}
			onClick={() => {onClickHandler()}}
		>
			{text}
		</button>
	);
}

export default RestartButton;
