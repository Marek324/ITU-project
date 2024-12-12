import React from "react";

const PowerupCount = ({ count }) => {
	return (
		<div className="flex gap-2">
			{[...Array(3)].map((_, i) => (
				<div
					key={i}
					className={`w-3 h-1 rounded border ${
						i < count
						? 'bg-gray-300 border-gray-400'
						: 'bg-gray-600 border-gray-700'
					}`}
				/>
			))}
		</div>
	);
}

export default PowerupCount;
