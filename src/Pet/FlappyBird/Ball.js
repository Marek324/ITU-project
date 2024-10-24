import React, { forwardRef } from "react";
import ballImg from "./Assets/ball.png";

const Ball = forwardRef(({ top, leftPos }, ref) => {
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				top: `${top}px`,
				left: `${leftPos}%`,
				width: "4vw",
				height: "4vw",
				backgroundImage: `url(${ballImg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		/>
	);
});

export default Ball;
