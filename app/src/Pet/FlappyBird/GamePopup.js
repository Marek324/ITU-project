import React from 'react';

//Popup that appears when the game starts or ends
function GamePopup({onStart, topBarSize, bottomPos, title, subtitle, topScore}) {
	return (
		<div
			className="absolute left-0 right-0 flex items-center justify-center z-1000"
			style={{top: topBarSize, bottom: bottomPos, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
		>
			<div className="bg-Pet_Header_BG p-5 rounded-lg text-center">

				{/* Title of the popup */}
				<h1 className="text-Pet_Text text-pet font-Pet_Title text-2xl mb-4"
					style={{textShadow: '1px 1px 0 black'}}>{title}</h1>

				{/* Display the top score */}
				<p className="text-Pet_Text text-pet font-Pet_Title text-xl mb-4"
				   style={{textShadow: '1px 1px 0 black'}}>
					Top Score: <span className="text-yellow-500">{topScore}</span>
				</p>

				{/* Button to start the game */}
				<button
					className="px-4 py-2 bg-green-500 rounded cursor-pointer text-subtext"
					style={{textShadow: '1px 1px 0 black'}}
					onClick={onStart}
				>
					{subtitle}
				</button>
			</div>
		</div>
	);
}

export default GamePopup;
