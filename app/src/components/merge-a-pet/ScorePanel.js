import React from "react";
import RestartButton from "./RestartButton";

const ScorePanel = ({ score, onRestart }) => {
	return (
		<div
			className={`
				flex flex-row justify-center justify-between w-full p-4

				text-white
				font-bold text-lg
			`}
		>
			<div></div>
			<div className="flex flex-col justify-center w-32 shadow-md text-center rounded-lg" >Score: {score}</div>
			<RestartButton onClickHandler={onRestart} />
			<div></div>
		</div>);
}


export default ScorePanel;
