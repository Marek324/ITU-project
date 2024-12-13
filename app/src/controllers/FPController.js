import GameView from "../views/FPView";
import React, {useEffect, useRef, useState} from 'react';
import FPModel from "../FPModel.js";
import {useParams} from "react-router-dom";

const FPController = () => {
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

	//Načtení highscore
	useEffect(() => {
		model.init().then(() => {
			setHighScore(model.highScore);
			setScores(model.scores);
			setColors(model.colors);
			setCoins(model.money);
		});
	}, [model]);


	//Volání skoku / startu hry
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


	const stopGame = async () => {
		if (model.score > model.highScore) {
			await model.updateHighScore();
			setHighScore(model.highScore);
		}
		model.stopGame();
		updateState();
	};

	const toggleShop = () => {
		model.toggleShop();
		updateState();
	};

	const toggleLeaderboard = () => {
		model.toggleLeaderboard();
		updateState();
	};

	const startGame = () => {
		model.startGame();
		updateState();
	};

	const buyColor = (color) => {
		model.buyColor(color);
		updateState();
	}

	const selectColor = (color) => {
		model.selectColor(color);
		updateState();
	}

	const updateState = () => {
		setShowPopup(model.showPopup);
		setGameStarted(model.gameStarted);
		setObstacles([...model.obstacles]);
		setLeaderboard(model.showLeaderboard);
		setShowShop(model.showStore);
		setCurrentColor(model.equippedColor);
		setCoins(model.money);
		setColors([...model.colors]);
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
