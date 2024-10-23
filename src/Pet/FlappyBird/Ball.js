import React from "react";
import ballImg from "./Assets/ball.png";

function Ball({top}) {
	return (
		<div
			style={{
				position: "absolute",
				top: `${top}px`,
				left: "10%",
				width: "4vw",
				height: "4vw",
				backgroundImage: `url(${ballImg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		/>
	);
}

export default Ball;
