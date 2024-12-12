import React from "react";
import Board from "components/merge-a-pet/Board";
import ScorePanel from "components/merge-a-pet/ScorePanel";
import PowerupPanel from "components/merge-a-pet/PowerupPanel";


const MergeView = ({ grid, score, gameOver, buttonHandlers, powerupCounts }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
			{/* header */}
			<ScorePanel score={score} onRestart={buttonHandlers.handleRestartGame} />
			<Board grid={grid} gameOver={gameOver} onSelectTile={buttonHandlers.onSelectTile} />
			<PowerupPanel buttonHandlers={buttonHandlers} powerupCounts={powerupCounts} />
        </div>
    );
};

export default MergeView;
