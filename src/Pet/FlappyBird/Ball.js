import React from "react";

function Ball({top}) {
	return (
		<div
			style={{
				position: "absolute",
				top: `${top}px`,
				left: "10%",
				width: "4vw",
				height: "4vw",
				backgroundImage: `url('https://i.postimg.cc/K8yG6KM0/image-2024-10-20-201936398.png')`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		/>
	);
}

export default Ball;
