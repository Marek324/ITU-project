import React from "react";
import PowerupButton from "./PowerupButton";
import { undo, deleteTile, swapTiles, deleteTilesByNumber } from "svg";

const PowerupPanel = ({ buttonHandlers, powerupCounts }) => {
	return (
		<div
			className={`
				flex items-center justify-between
				p-4
				pb-3
				bg-gray-600
				rounded-lg
				mt-4
			`}
		>
			<PowerupButton onClickHandler={buttonHandlers.handleUndoMove} svg={undo} count={powerupCounts.undoMove} />
			<PowerupButton onClickHandler={buttonHandlers.handleDeleteTile} svg={deleteTile} count={powerupCounts.deleteTile} />
			<PowerupButton onClickHandler={buttonHandlers.handleSwapTiles} svg={swapTiles} count={powerupCounts.swapTiles} />
			<PowerupButton onClickHandler={buttonHandlers.handleDeleteTilesByNumber} svg={deleteTilesByNumber} count={powerupCounts.deleteTilesByNumber} />
		</div>
	);
}

export default PowerupPanel;
