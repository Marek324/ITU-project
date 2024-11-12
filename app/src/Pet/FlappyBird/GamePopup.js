import React from 'react';

function GamePopup({ onStart, topBarSize, bottomPos, title, subtitle, topScore }) {
	return (
		<div
			className="absolute left-0 right-0 flex items-center justify-center z-1000"
			style={{ top: topBarSize, bottom: bottomPos, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
		>
			<div className="bg-Pet_Header_BG p-5 rounded-lg text-center">
				<h1 className="text-Pet_Text text-pet font-Pet_Title text-2xl">{title}</h1>
				<p className="text-Pet_Text text-pet font-Pet_Title text-xl">Top Score: {topScore}</p>
				<button
					className="px-4 py-2 bg-green-500 rounded cursor-pointer text-subtext"
					onClick={onStart}
				>
					{subtitle}
				</button>
			</div>
		</div>
	);
}

export default GamePopup;
