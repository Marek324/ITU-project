import GameView from "../views/FPView";
import React, { useEffect, useRef, useState } from 'react';
import FPModel from "../FPModel.js";

const FPController = () => {
	const [model, setModel] = useState(new FPModel());
	const [showPopup, setShowPopup] = useState(model.showPopup);
	const [highScore, setHighScore] = useState(model.highScore);
	const [ballTopPos, setBallTopPos] = useState(model.ballTopPos);
	const [gameStarted, setGameStarted] = useState(model.gameStarted);
	const [obstacles, setObstacles] = useState(model.obstacles);

	model.ballRef = useRef(null);
	model.topBarRef = useRef(null);
	model.downBarRef = useRef(null);

	//Načtení highscore
	useEffect(() => {
		model.fetchHighScore().then(() => {
			setHighScore(model.highScore);
		});
	}, [model]);


	//Volání skoku
	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((event.code === 'Space' || event.code === 'ArrowUp')) {
				model.jump();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [model]);

	//Zakázání scrollování
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	//Nastavení pozice topBaru a downBaru
	useEffect(() => {
		if (model.topBarRef.current) {
			model.setTopPos(model.topBarRef.current.clientHeight);
		}
		if (model.downBarRef.current) {
			model.setDownBarOffset(model.downBarRef.current.clientHeight);
		}
	}, [model.topBarRef, model.downBarRef, model]);

	//Pohyb a kolize
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

	//Spawnování překážek
	useEffect(() => {
		const interval = setInterval(() => {
			if (!gameStarted) return;
			model.addObstacle(model.topPos);
			setObstacles([...model.obstacles]);
		}, model.consts.spawnInterval);

		return () => clearInterval(interval);
	}, [gameStarted, model]);


	const stopGame = () => {
		model.stopGame();
		if (model.score > model.highScore) {
			model.updateHighScore().then(() => {
				setHighScore(model.highScore);
			});
		}
		updateState();
	};

	const toggleLeaderboard = () => {
		model.toggleLeaderboard();
	};

	const startGame = () => {
		model.startGame();
		updateState();
	};

	const updateState = () => {
		setShowPopup(model.showPopup);
		setGameStarted(model.gameStarted);
		setObstacles([...model.obstacles]);
	};

	return (
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
			showLeaderboard={model.showLeaderboard}
			toggleLeaderboard={toggleLeaderboard}
			topBarRef={model.topBarRef}
			downBarRef={model.downBarRef}
		/>
	);
};

export default FPController;
