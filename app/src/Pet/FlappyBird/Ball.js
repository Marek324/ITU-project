//Author: Lukáš Píšek (xpisek02)
//File: Ball.js
//Description: Ball component for Flappy Bird game

import React, {forwardRef} from "react";
import ballImg from "./Assets/ball.png";

//Ball component
const Ball = forwardRef(({top, leftPos, filter}, ref) => {
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				top: `${top}px`,
				left: `${leftPos}%`,
				width: "6vh",
				height: "6vh",
				backgroundImage: `url(${ballImg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				filter: filter,
			}}
		/>
	);
});

export default Ball;
