import React from "react";

function Obstacle ({ topPos, topHeight, bottomPos, bottomHeight, left })
{

	return (
		<div>
			<div
				style={{
					position: "absolute",
					top: '${topPos}px',
					left: `${left}px`,
					width: "5vw",
					height: `${topHeight}px`,
					backgroundColor: "violet",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: `${bottomPos}px`,
					left: `${left}px`,
					width: "5vw",
					height: `${bottomPos + bottomHeight}px`,
					backgroundColor: "violet",
				}}
			/>
		</div>
	);
}

export default Obstacle;
