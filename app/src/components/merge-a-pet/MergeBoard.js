import React from "react";
import MergeTile from "./MergeTile";

const MergeBoard = ({ grid, gameOver}) => {
	return (
		<div className="relative flex flex-col items-center justify-center">
			{gameOver && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
					<h1 className="text-white text-4xl font-bold">Game Over</h1>
				</div>
			)}

			<div
				className={`
					grid grid-rows-4 grid-cols-4 gap-2
					relative
				`}
				>
				{/* Empty tiles */}
				{Array.from({length: 16}).map((_, index) => (
					<div key={`empty-${index}`} className="bg-gray-200 rounded-lg size-32"></div>
				))}

				{grid.map((row, rowIndex) => (
					row.map((cell, colIndex) => (
						<MergeTile key={`${rowIndex}-${colIndex}`} tile={cell} row={rowIndex} col={colIndex} />
					))
				))}
			</div>
		</div>
	);
}

export default MergeBoard;
