import React, { useState, useEffect } from "react";
import MergeModel from "MergeModel";
import MergeView from "views/MergeView";

const MergeController = () => {
    const [model, setModel] = useState(new MergeModel());
    const [grid, setGrid] = useState(model.grid);
    const [score, setScore] = useState(model.score);

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
    };

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, []);

	const buttonHandlers = {
		handleRestartGame : () => {
			model.startGame();
			updateState();
		},

        handleUndoMove : () => {
            model.undoMove();
            updateState();
        },

        handleSwapTiles : (tile1, tile2) => {
			// if (tile1 == null)
			// 	() => {} // tile should be button, add some selectTile func, recursively call this ig or something
			// if (tile2 == null)
			// 	() => {}

            model.swapTiles(tile1, tile2);
            updateState();
        },

        handleDeleteTile : (tile) => {
            model.deleteTile(tile);
            updateState();
        },

        handleDeleteTilesByNumber : (number) => {
            model.deleteTilesByNumber(number);
            updateState();
        },
	};

	return <MergeView grid={grid} score={score} gameOver={model.gameOver} buttonHandlers={buttonHandlers} />;
};

export default MergeController;
