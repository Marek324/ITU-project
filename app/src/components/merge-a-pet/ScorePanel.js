import React from "react";
import RestartButton from "./RestartButton";

const ScorePanel = ({ score, onRestart }) => {
	return (
		<div
			className={`
				flex items-center justify-between w-full p-4
			`}
		>
			<div>Score: {score}</div>
			<RestartButton onClickHandler={onRestart} text={"Restart"} />
		</div>);
}


export default ScorePanel;
