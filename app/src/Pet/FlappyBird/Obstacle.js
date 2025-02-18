//Author: Lukáš Píšek (xpisek02)
//File: Obstacle.js
//Description: Component for rendering obstacles in Flappy Bird game


import React from "react";

//Obstacle component
function Obstacle({topPos, topHeight, bottomPos, bottomHeight, left, widthNum}) {
	return (
		<div>
			<div
				style={{
					position: "absolute",
					top: `${topPos}px`,
					left: `${left}px`,
					width: `${widthNum}vw`,
					height: `${topHeight}px`,
					backgroundColor: "violet",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: `${bottomPos}px`,
					left: `${left}px`,
					width: `${widthNum}vw`,
					height: `${bottomHeight}px`,
					backgroundColor: "violet",
				}}
			/>
		</div>
	);
}

export default Obstacle;
