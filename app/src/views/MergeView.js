import React from "react";
import Board from "components/merge-a-pet/Board";
import ScorePanel from "components/merge-a-pet/ScorePanel";
import PowerupPanel from "components/merge-a-pet/PowerupPanel";


const MergeView = ({ grid, score, gameOver, buttonHandlers, powerupCounts, getTileColor }) => {
    return (
		<div className="flex items-center justify-center mt-10" >
			<div className="flex flex-col items-center justify-center w-[40rem] bg-gray-700 rounded-lg">
				{/* header */}
				<ScorePanel score={score} onRestart={buttonHandlers.handleRestartGame} />
				<Board grid={grid} gameOver={gameOver} onSelectTile={buttonHandlers.onSelectTile} />
				<PowerupPanel buttonHandlers={buttonHandlers} powerupCounts={powerupCounts} />
			</div>
		</div>
    );
};

export default MergeView;
