import React, { forwardRef } from "react";
import ballImg from "./Assets/ball.png";

const Ball = forwardRef(({ top }, ref) => {
	return (
		<div
			ref={ref}
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
});

export default Ball;
