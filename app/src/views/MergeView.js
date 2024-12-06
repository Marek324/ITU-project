import React from "react";
import MergeBoard from "components/merge-a-pet/MergeBoard";
import MergeScore from "components/merge-a-pet/MergeScore";
import MergePlayAgainButton from "components/merge-a-pet/MergePlayAgainButton";


const MergeView = ({ grid, score, gameOver, onRestart }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
			{/* header */}
			<MergeScore score={score} />
			<MergeBoard grid={grid} gameOver={gameOver} onRestart={onRestart} />
			<MergePlayAgainButton onRestart={onRestart} />
        </div>
    );
};

export default MergeView;
