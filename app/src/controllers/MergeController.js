import React, { useState, useEffect } from "react";
import MergeModel from "MergeModel";
import MergeView from "views/MergeView";

const GameController = () => {
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

    const restartGame = () => {
        const newModel = new MergeModel();
        setModel(newModel);
		model.startGame();
        updateState();
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return <MergeView grid={grid} score={score} gameOver={model.gameOver} onRestart={restartGame} />;
};

export default GameController;
