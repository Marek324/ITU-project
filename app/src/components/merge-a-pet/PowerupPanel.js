/**
 * PowerupPanel.js
 * Author: Marek Hric xhricma00
 */

import React from "react";
import PowerupButton from "./PowerupButton";
import { undo, deleteTile, swapTiles, deleteTilesByNumber } from "svg";

const PowerupPanel = ({ buttonHandlers, powerupCounts }) => {
	return (
		<div
			className={`
				flex items-center justify-between
				p-4 pb-3
				w-full
			`}
		>
			<PowerupButton onClickHandler={buttonHandlers.handleUndoMove} svg={undo} powerupName={"undo"} count={powerupCounts.undoMove} />
			<PowerupButton onClickHandler={buttonHandlers.handleDeleteTile} svg={deleteTile} powerupName={"delete"} count={powerupCounts.deleteTile} />
			<PowerupButton onClickHandler={buttonHandlers.handleSwapTiles} svg={swapTiles} powerupName={"swap"} count={powerupCounts.swapTiles} />
			<PowerupButton onClickHandler={buttonHandlers.handleDeleteTilesByNumber} svg={deleteTilesByNumber} powerupName={"deletenum"} count={powerupCounts.deleteTilesByNumber} />
		</div>
	);
}

export default PowerupPanel;
