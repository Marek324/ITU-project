/**
 * MergeController.js
 * Author: Marek Hric xhricma00
 */

import React, { useState, useEffect, useCallback } from "react";
import MergeModel from "MergeModel";
import MergeView from "views/MergeView";
import ClickContext from "./ClickContext";

const MergeController = () => {
    const [model, setModel] = useState(new MergeModel());
    const [grid, setGrid] = useState(model.grid);
    const [score, setScore] = useState(model.score);
	const [clickContext, setClickContext] = useState(null);
	const [powerupCounts, setPowerupCounts] = useState(model.powerups);

    const handleKeyPress = (event) => {
		const keyMap = {
			ArrowUp: "UP",
            ArrowDown: "DOWN",
            ArrowLeft: "LEFT",
            ArrowRight: "RIGHT",
        };
        const direction = keyMap[event.key];
        if (direction) {
			model.move(direction);
            updateState();
        }
    };

    const updateState = () => {
		setGrid([...model.grid]);
        setScore(model.score);
		setPowerupCounts({ ...model.powerups });
    };

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, []);

	const handleRestartGame = useCallback(() => {
		model.startGame();
		updateState();
	}, []);

	const handleUndoMove = useCallback(() => {
		model.undoMove();
		updateState();
	}, []);

	const handleSwapTiles = useCallback(() => {
		const context1 = new ClickContext();
		setClickContext(context1);

		context1.getSelectedTile().then((tile1) => {
			const context2 = new ClickContext();
			setClickContext(context2);

			context2.getSelectedTile().then((tile2) => {
				model.swapTiles(tile1, tile2);
				setClickContext(null);
				updateState();
			}).catch((err) => {
				console.error("Error selecting second tile: ", err);
				setClickContext(null);
			});
		}).catch((err) => {
			console.error("Error selecting first tile: ", err);
			setClickContext(null);
		});
	}, []);

	const handleDeleteTile = useCallback(() => {
		const context = new ClickContext();
		setClickContext(context);

		context.getSelectedTile().then((tile) => {
			model.deleteTile(tile);
			setClickContext(null);
			updateState();
		}).catch((err) => {
			console.error("Error selecting tile: ", err);
			setClickContext(null);
		});
	}, []);

	const handleDeleteTilesByNumber = useCallback(() => {
		const context = new ClickContext();
		setClickContext(context);

		context.getSelectedTile().then((tile) => {
			model.deleteTilesByNumber(tile);
			setClickContext(null);
			updateState();
		}).catch((err) => {
			console.error("Error selecting tile: ", err);
			setClickContext(null);
		});
	}, []);

	const onSelectTile = useCallback((tile) => {
		if (clickContext) {
			clickContext.select(tile);
		} else {
			console.log("No active click context");
		}
	}, [clickContext]);

	const buttonHandlers = {
		handleRestartGame,
		handleUndoMove,
		handleSwapTiles,
		handleDeleteTile,
		handleDeleteTilesByNumber,
		onSelectTile
	};

	return (
		<MergeView
			grid={grid}
			score={score}
			gameOver={model.gameOver}
			buttonHandlers={buttonHandlers}
			powerupCounts={powerupCounts}
		/>
	);
};

export default MergeController;
