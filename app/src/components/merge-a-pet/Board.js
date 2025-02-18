/**
 * Board.js
 * Author: Marek Hric xhricma00
 */

import React from "react";
import Tile from "./Tile";

const Board = ({ grid, gameOver, onSelectTile, getTileColor }) => {
	return (
		<div className="relative flex flex-col items-center justify-center p-10 pt-2 w-full">
			{gameOver && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
					<h1 className="text-white text-4xl font-bold">Game Over</h1>
				</div>
			)}

			<div className="relative">
				{grid.map((row, rowIndex) => (
					row.map((cell, colIndex) => (
						<Tile key={`${rowIndex}-${colIndex}`} tile={cell} onSelectTile={onSelectTile} />
					))
				))}
				<div
					className={`
						grid grid-rows-4 grid-cols-4 gap-2
					`}
					>
					{/* Empty tiles */}
					{Array.from({length: 16}).map((_, index) => (
						<div key={`empty-${index}`} className="bg-gray-200 rounded-lg size-32"></div>
					))}
				</div>

			</div>
		</div>
	);
}

export default Board;
