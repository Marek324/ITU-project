import GameView from "../views/FPView";
import React, {useEffect, useRef, useState} from 'react';
import FPModel from "../FPModel.js";
import {useParams} from "react-router-dom";

const FPController = () => {
	//Setting references and states
	const animalId = useParams().id;
	const [model, setModel] = useState(new FPModel(animalId));
	const [showPopup, setShowPopup] = useState(model.showPopup);
	const [highScore, setHighScore] = useState(model.highScore);
	const [ballTopPos, setBallTopPos] = useState(model.ballTopPos);
	const [gameStarted, setGameStarted] = useState(model.gameStarted);
	const [obstacles, setObstacles] = useState(model.obstacles);
	const [leaderboard, setLeaderboard] = useState(model.showLeaderboard);
	const [scores, setScores] = useState(model.scores);
	const [showShop, setShowShop] = useState(model.showStore);
	const [colors, setColors] = useState(model.colors);
	const [currentColor, setCurrentColor] = useState(model.equippedColor);
	const [coins, setCoins] = useState(model.money);

	model.ballRef = useRef(null);
	model.topBarRef = useRef(null);
	model.downBarRef = useRef(null);

	//Initialization
	useEffect(() => {
		model.init().then(() => {
			setHighScore(model.highScore);
			setScores(model.scores);
			setColors(model.colors);
			setCoins(model.money);
		});
	}, [model]);


	//Starting game / jumping on spacebar or arrow up
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.code === 'Space' || event.code === 'ArrowUp') {
				if (!gameStarted && model.showPopup) {
					startGame();
				}
				model.jump();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [gameStarted, model]);

	//Turning off scrollbar
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	//Top bar and down bar height
	useEffect(() => {
		if (model.topBarRef.current) {
			model.setTopPos(model.topBarRef.current.clientHeight);
		}
		if (model.downBarRef.current) {
			model.setDownBarOffset(model.downBarRef.current.clientHeight);
		}
	}, [model.topBarRef, model.downBarRef, model]);

	//Moving the ball and checking for collision
	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			model.updatePosition();
			setBallTopPos(model.ballTopPos);
			model.updateObstacles();
			if (model.checkCollision()) {
				stopGame();
			}
		}, model.consts.timeInterval);

		return () => clearInterval(interval);
	}, [gameStarted, model]);

	//Creating new obstacles
	useEffect(() => {
		const interval = setInterval(() => {
			if (!gameStarted) return;
			model.addObstacle(model.topPos);
			setObstacles([...model.obstacles]);
		}, model.consts.spawnInterval);

		return () => clearInterval(interval);
	}, [gameStarted, model]);


	//Stopping the game
	const stopGame = async () => {
		//Updating high score if user has beaten the old one
		if (model.score > model.highScore) {
			await model.updateHighScore();
			setHighScore(model.highScore);
		}
		model.stopGame();
		updateState();
	};


	//Showing/hiding shop
	const toggleShop = () => {
		model.toggleShop();
		updateState();
	};

	//Showing/hiding leaderboard
	const toggleLeaderboard = () => {
		model.toggleLeaderboard();
		updateState();
	};

	//Starting the game
	const startGame = () => {
		model.startGame();
		updateState();
	};

	//Buying a color
	const buyColor = (color) => {
		model.buyColor(color);
		updateState();
	}

	//Selecting a color for the ball
	const selectColor = (color) => {
		model.selectColor(color);
		updateState();
	}

	//Updating states to update the view
	const updateState = () => {
		setShowPopup(model.showPopup);
		setGameStarted(model.gameStarted);
		setObstacles([...model.obstacles]);
		setLeaderboard(model.showLeaderboard);
		setShowShop(model.showStore);
		setCurrentColor(model.equippedColor);
		setCoins(model.money);
		setColors([...model.colors]);
		setScores([...model.scores]);
	};

	return (
		<div className="w-full h-full">
			<GameView
				gameStarted={gameStarted}
				showPopup={showPopup}
				title={model.title}
				subtitle={model.subtitle}
				highScore={highScore}
				startGame={startGame}
				topPos={model.topPos}
				downBarOffset={model.downBarOffset}
				obstacles={obstacles}
				ballTopPos={ballTopPos}
				consts={model.consts}
				ballRef={model.ballRef}
				score={model.score}
				showLeaderboard={leaderboard}
				toggleLeaderboard={toggleLeaderboard}
				topBarRef={model.topBarRef}
				downBarRef={model.downBarRef}
				scores={scores}
				toggleShop={toggleShop}
				showShop={showShop}
				colors={colors}
				currentColor={currentColor}
				coins={coins}
				onColorBuy={buyColor}
				onColorSelect={selectColor}
			/>
		</div>
	);
};

export default FPController;
