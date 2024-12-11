import GameView from "../views/FPView";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {GetFP, UpdateFP} from "../services/FlappyPetService";


const FPController = () => {
	const consts = {
		timeInterval: 10,
		gravity: 5,
		obstRelativeWidth: 5,
		ballLeftPos: 10
	};

	const [model, setModel] = useState(new GameModel());
	const [gameStarted, setGameStarted] = useState(false);
	const [title, setTitle] = useState('Flappy Pet');
	const [subtitle, setSubtitle] = useState('Start Game');
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showPopup, setShowPopup] = useState(true);
	const [topPos, setTopPos] = useState(0);
	const [downBarOffset, setBottomBarOffset] = useState(0);
	const [spawnInterval, setSpawnInterval] = useState(2000);
	const [gapSize, setGapSize] = useState(window.innerHeight * 0.28);
	const [obstSpeed, setObstSpeed] = useState(window.innerWidth * 0.0022);
	const [maxVelocity, setMaxVelocity] = useState(window.innerHeight * 0.0085);
	const [data, setData] = useState(null);

	const ballRef = useRef(null);
	const topBarRef = useRef(null);
	const downBarRef = useRef(null);

	useEffect(() => {
		GetFP(0).then((data) => {
			setData(data);
			model.initialize(data);
		});
	}, [model]);

	const jump = useCallback(() => {
		model.jump(maxVelocity);
	}, [maxVelocity, model]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((event.code === 'Space' || event.code === 'ArrowUp')) {
				jump();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [jump]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	useEffect(() => {
		if (topBarRef.current) {
			setTopPos(topBarRef.current.clientHeight);
		}
		if (downBarRef.current) {
			setBottomBarOffset(downBarRef.current.clientHeight);
		}
	}, [topBarRef, downBarRef]);

	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			model.updatePosition(consts);
			model.updateObstacles(obstSpeed, consts);
			if (model.checkCollision(ballRef, topPos, downBarOffset)) {
				stopGame();
			}
			setModel({ ...model });
		}, consts.timeInterval);

		return () => clearInterval(interval);
	}, [gameStarted, model, obstSpeed, topPos, downBarOffset]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!gameStarted) return;
			const topHeight = Math.floor(Math.random() * (window.innerHeight - downBarOffset - topPos - gapSize - 50));
			const bottomPos = topHeight + gapSize;
			model.addObstacle(topPos, topHeight, bottomPos, gapSize);
			setModel({ ...model });
		}, spawnInterval);

		return () => clearInterval(interval);
	}, [spawnInterval, gapSize, gameStarted, downBarOffset, topPos, model]);

	const toggleLeaderboard = () => {
		setShowLeaderboard(prevState => !prevState);
		setShowPopup(!showLeaderboard);
	};

	const UpdateHighScore = () => {
		const updatedData = { ...data, highscore: model.score };
		UpdateFP(data.id, updatedData).then(() => {
			setData(updatedData);
		});
	};

	const stopGame = () => {
		setTitle('Game Over');
		setSubtitle('Restart Game');
		setGameStarted(false);
		setShowPopup(true);
		if (model.score > model.highScore) {
			UpdateHighScore();
		}
	};

	const startGame = () => {
		setGameStarted(true);
		setShowPopup(false);
		model.startGame();
		setModel({ ...model });
	};

	return (
		<GameView
			gameStarted={gameStarted}
			showPopup={showPopup}
			title={title}
			subtitle={subtitle}
			highScore={model.highScore}
			startGame={startGame}
			topPos={topPos}
			downBarOffset={downBarOffset}
			obstacles={model.obstacles}
			ballTopPos={model.ballTopPos}
			consts={consts}
			ballRef={ballRef}
			score={model.score}
			showLeaderboard={showLeaderboard}
			toggleLeaderboard={toggleLeaderboard}
		/>
	);
};

export default FPController;
