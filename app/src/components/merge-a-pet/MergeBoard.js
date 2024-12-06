import React from "react";
import MergeRow from "components/merge-a-pet/MergeRow";

const MergeBoard = ({ grid, gameOver}) => {
	return (
		<div className="relative flex flex-col items-center justify-center">
			{gameOver && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
					<h1 className="text-white text-4xl font-bold">Game Over</h1>
				</div>
			)}
			{grid.map((row, rowIndex) => (
				<MergeRow key={rowIndex} row={row} />
			))}
		</div>
	);
}

export default MergeBoard;
