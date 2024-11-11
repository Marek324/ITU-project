import React, { useEffect, useRef, useState, useCallback } from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import {homeB, shop, leaderboard, game} from "../../svg";
import bGImage from "./Assets/bg.jpg";
import Ball from "./Ball.js";
import Obstacle from "./Obstacle";
import GamePopup from "./GamePopup";
import HighScores from "./HighScores";

function Game() {
	const consts = {
		timeInterval: 10,
		gravity: 5,
		obstRelativeWidth: 5,
		ballLeftPos: 10
	}

	const [ballTopPos, setBallTopPos] = useState(window.innerHeight / 2);
	const [velocity, setVelocity] = useState(0);
	const [obstacles, setObstacles] = useState([]);
	const [topPos, setTopPos] = useState(0);
	const [downBarOffset, setBottomBarOffset] = useState(0);
	const [spawnInterval, setSpawnInterval] = useState(2000);
	const [gapSize, setGapSize] = useState(window.innerHeight * 0.28);
	const [obstSpeed, setObstSpeed] = useState(window.innerWidth * 0.0012);
	const [maxVelocity, setMaxVelocity] = useState(window.innerHeight * 0.0085);
	const [gameStarted, setGameStarted] = useState(false);
	const [title, setTitle] = useState('Flappy Pet');
	const [subtitle, setSubtitle] = useState('Start Game');
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showPopup, setShowPopup] = useState(true);

	const topBarRef = useRef(null);
	const downBarRef = useRef(null);
	const ballRef = useRef(null);

	/* Eventy pro resize
	useEffect(() => {
		const handleResize = () => {
			setSpawnInterval(window.innerWidth * 0.6);
			setGapSize(window.innerHeight * 0.28);
			setObstSpeed(window.innerWidth * 0.0012);
			setMaxVelocity(window.innerHeight * 0.0085);
			setObstacles([]);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);*/

	// Skok
	const jump = useCallback(() => {
		setVelocity(-maxVelocity * window.innerHeight * 0.003);
	}, [maxVelocity]);

	// Event na skok
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

	// Vypnutí scrollbaru
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	// Nastavit topPos překážky
	useEffect(() => {
		if (topBarRef.current) {
			setTopPos(topBarRef.current.clientHeight);
		}
		if (downBarRef.current) {
			setBottomBarOffset(downBarRef.current.clientHeight);
		}
	}, [topBarRef, downBarRef]);

	// Fyzika
	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			console.log(gameStarted);
			// Nastavení rychlosti míčku
			setVelocity((prevVelocity) => prevVelocity + consts.gravity * consts.timeInterval * 0.01 * window.innerHeight * 0.001);

			// Limitace rychlosti míčku
			if (velocity > maxVelocity) {
				setVelocity(maxVelocity);
			}
			if (velocity < -maxVelocity) {
				setVelocity(-maxVelocity);
			}

			// Nastavení pozice míčku
			setBallTopPos(prevTop => prevTop + velocity + 0.5 * consts.gravity * Math.pow(consts.timeInterval * 0.01, 2));

			// Pohyb překážek
			setObstacles(prevObstacles => {
				return prevObstacles.map((obstacle) => {
					obstacle.left -= obstSpeed;
					return obstacle;
				});
			});

			// Odstranění nepotřebných překážek
			setObstacles(prevObstacles => {
				return prevObstacles.filter((obstacle) => {
					return obstacle.left > -consts.obstRelativeWidth * (window.innerWidth * 0.01);
				});
			});

		}, consts.timeInterval);

		return () => clearInterval(interval);
	}, [ballTopPos, gameStarted, velocity, obstacles, obstSpeed]);

	// Generování překážek
	useEffect(() => {
		const interval = setInterval(() => {
			if (!gameStarted) return;

			const topHeight = Math.floor(Math.random() * (window.innerHeight - downBarOffset - topPos - gapSize - 50));
			const bottomPos = topHeight + gapSize;
			const left = window.innerWidth;

			setObstacles(prevObstacles => {
				return [...prevObstacles, { topPos: topPos, topHeight: topHeight, bottomPos: bottomPos, bottomHeight: window.innerHeight - downBarOffset - bottomPos, left: left }];
			});

		}, spawnInterval);

		return () => clearInterval(interval);
	}, [spawnInterval, gapSize, gameStarted]);

	// Kontrola kolize s překážkou
	useEffect(() => {
		const checkCollision = () => {
			if (!gameStarted || !ballRef) return;

			if (topBarRef.current && (ballTopPos <= topPos)) {
				stopGame();
				return;
			}
			if (downBarRef.current && ballRef.current && (ballTopPos >= (window.innerHeight - downBarOffset - ballRef.current.clientHeight))) {
				stopGame();
				return;
			}

			// Lazy ale funguje
			for (let ob of obstacles) {
				// Horizontální
				const obWidth = consts.obstRelativeWidth * (window.innerWidth * 0.01);
				const obLeft = ob.left - (obWidth * 0.5);
				const obRight = ob.left + (obWidth * 0.5);

				// Vertikální
				const obTop = ob.topHeight + topPos;
				const obBottom = ob.bottomPos;

				// Horizontální
				const ballLeft = window.innerWidth * 0.01 * consts.ballLeftPos;
				const ballTopLeft = ballLeft - ballRef.current.clientWidth * 0.5;
				const ballTopRight = ballLeft + ballRef.current.clientWidth * 0.5;

				// Vertikální
				const ballTop = ballTopPos;
				const ballBottom = ballTopPos + ballRef.current.clientHeight;

				// Kontrole kolize
				const horizontalOverlap = ballTopLeft <= obRight && ballTopRight >= obLeft;
				const verticalOverlap = ballTop <= obTop || ballBottom >= obBottom;

				if (horizontalOverlap && verticalOverlap) {
					stopGame();
					break;
				}
			}
		}

		const interval = setInterval(checkCollision, consts.timeInterval);
		return () => clearInterval(interval);

	}, [gameStarted, velocity]);

	const toggleLeaderboard = () => {
		setShowLeaderboard(prevState => !prevState);
		if (showLeaderboard) {
			setShowPopup(true);
		}
		else {
			setShowPopup(false);
		}
	}

	function stopGame() {
		setTitle('Game Over');
		setSubtitle('Restart Game');
		setGameStarted(false);
		setShowPopup(true);
	}

	function startGame() {
		setGameStarted(true);
		setShowPopup(false);
		setObstacles([]);
		setBallTopPos(window.innerHeight / 2);
		setVelocity(0);
	}

	return (
		<div
			className="game-container min-h-screen flex flex-col bg-cover bg-center"
			style={{ backgroundImage: `url(${bGImage})` }}
		>
			<TopBar ref={topBarRef} title="Flappy Pet" />
			<DownBar ref={downBarRef} firstIcon={shop()} secondIcon={homeB()} thirdIcon={leaderboard()} onThirdClick={toggleLeaderboard}/>
			{showPopup && <GamePopup title={title} subtitle={subtitle} onStart={startGame} topBarSize={topPos} bottomPos={downBarOffset} />}
			{gameStarted && (
				<>
					<Ball ref={ballRef} leftPos={consts.ballLeftPos} top={ballTopPos} />
					{obstacles.map((obstacle, index) => (
						<Obstacle
							key={index}
							topPos={topPos}
							topHeight={obstacle.topHeight}
							bottomPos={obstacle.bottomPos}
							bottomHeight={window.innerHeight - downBarOffset - obstacle.bottomPos}
							left={obstacle.left}
							widthNum={consts.obstRelativeWidth}
						/>
					))}
				</>
			)}
			{showLeaderboard && <HighScores scores={[{ name: 'Player 1', points: 10 }, { name: 'Player 2', points: 20 }]} topBar={topPos} downBar={downBarOffset} />}
		</div>
	);
}

export default Game;
