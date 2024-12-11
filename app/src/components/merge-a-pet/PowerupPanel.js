import React from "react";
import PowerupButton from "./PowerupButton";

const PowerupPanel = ({ buttonHandlers }) => {
	return (
		<div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
			<PowerupButton onClickHandler={buttonHandlers.handleUndoMove} text={"Undo"} />
			<PowerupButton onClickHandler={buttonHandlers.handleDeleteTile} text={"Delete"} />
			<PowerupButton onClickHandler={buttonHandlers.handleSwapTiles} text={"Swap"} />
			<PowerupButton onClickHandler={buttonHandlers.handleDeleteTilesByNumber} text={"Delete by number"} />
		</div>
	);
}

export default PowerupPanel;
