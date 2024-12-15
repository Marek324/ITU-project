import React from "react";
import Board from "components/merge-a-pet/Board";
import ScorePanel from "components/merge-a-pet/ScorePanel";
import PowerupPanel from "components/merge-a-pet/PowerupPanel";
import Header from "components/merge-a-pet/Header";


const MergeView = ({ grid, score, gameOver, buttonHandlers, powerupCounts }) => {
    return (
		<div className="flex flex-col items-center justify-center" >
			<Header />
			<div className="flex flex-col items-center justify-center w-[40rem] bg-gray-700 rounded-lg">
				<ScorePanel score={score} onRestart={buttonHandlers.handleRestartGame} />
				<Board grid={grid} gameOver={gameOver} onSelectTile={buttonHandlers.onSelectTile} />
				<PowerupPanel buttonHandlers={buttonHandlers} powerupCounts={powerupCounts} />
			</div>
		</div>
    );
};

export default MergeView;
