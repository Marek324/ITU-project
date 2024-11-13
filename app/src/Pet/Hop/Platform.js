import React from "react";

function Platform({ top, left, width, height }) {
	return (
		<div
			style={{
				position: "absolute",
				top: `${top}px`,
				left: `${left}px`,
				width: `${width}px`,
				height: `${height}px`,
				backgroundColor: "green",
			}}
		/>
	);
}

export default Platform;
