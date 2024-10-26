import React, { useEffect, useRef, useState, useCallback } from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import { homeB } from "../../svg";
import bGImage from "./Assets/bg.jpg";
import Ball from "./Ball.js";
import Obstacle from "./Obstacle";
import GamePopup from "./GamePopup";

function Game() {
	const timeInterval = 10;
	const gravity = 5;
	const obstRelativeWidth = 5;
	const ballLeftPos = 10;

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

	const topBarRef = useRef(null);
	const downBarRef = useRef(null);
	const ballRef = useRef(null);

	// Eventy pro resize
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
	}, []);

	// Skok
	const jump = useCallback(() => {
		setVelocity(-maxVelocity * window.innerHeight * 0.003);
	}, [maxVelocity]);

	// Event na skok
	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((event.code === 'Space' || event.code === 'ArrowUp') && gameStarted) {
				jump();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [jump, gameStarted]);

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
	}, []);

	// Fyzika
	useEffect(() => {
		if (!gameStarted) return;

		if (topBarRef.current && (ballTopPos <= topPos)) {
			setTitle('Game Over');
			setSubtitle('Restart Game');
			setGameStarted(false);
			return;
		}
		if (downBarRef.current && ballRef.current && (ballTopPos >= (window.innerHeight - downBarOffset - ballRef.current.clientHeight))) {
			setTitle('Game Over');
			setSubtitle('Restart Game');
			setGameStarted(false);
			return;
		}

		const interval = setInterval(() => {
			// Nastavení rychlosti míčku
			setVelocity((prevVelocity) => prevVelocity + gravity * timeInterval * 0.01 * window.innerHeight * 0.001);

			// Limitace rychlosti míčku
			if (velocity > maxVelocity) {
				setVelocity(maxVelocity);
			}
			if (velocity < -maxVelocity) {
				setVelocity(-maxVelocity);
			}

			// Nastavení pozice míčku
			setBallTopPos((prevTop) => prevTop + velocity + 0.5 * gravity * Math.pow(timeInterval * 0.01, 2));

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
					return obstacle.left > -obstRelativeWidth * (window.innerWidth * 0.01);
				});
			});

		}, timeInterval);

		return () => clearInterval(interval);
	}, [velocity, obstacles, ballTopPos, downBarOffset, topPos, obstSpeed, maxVelocity, gameStarted]);

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
	}, [downBarOffset, topPos, spawnInterval, gapSize, gameStarted]);

	// Kontrola kolize s překážkou
	useEffect(() => {
		if (!gameStarted) return;
		const checkCollision = () => {
			if (!ballRef.current) {
				return;
			}

			// Lazy ale funguje
			for (let ob of obstacles) {
				// Horizontální
				const obWidth = obstRelativeWidth * (window.innerWidth * 0.01);
				const obLeft = ob.left - (obWidth * 0.5);
				const obRight = ob.left + (obWidth * 0.5);

				// Vertikální
				const obTop = ob.topHeight + topPos;
				const obBottom = ob.bottomPos;

				// Horizontální
				const ballLeft = window.innerWidth * 0.01 * ballLeftPos;
				const ballTopLeft = ballLeft - ballRef.current.clientWidth * 0.5;
				const ballTopRight = ballLeft + ballRef.current.clientWidth * 0.5;

				// Vertikální
				const ballTop = ballTopPos;
				const ballBottom = ballTopPos + ballRef.current.clientHeight;

				// Kontrole kolize
				const horizontalOverlap = ballTopLeft <= obRight && ballTopRight >= obLeft;
				const verticalOverlap = ballTop <= obTop || ballBottom >= obBottom;

				if (horizontalOverlap && verticalOverlap) {
					setTitle('Game Over');
					setSubtitle('Restart Game');
					setGameStarted(false);
				}
			}
		}

		const interval = setInterval(checkCollision, timeInterval);
		return () => clearInterval(interval);

	}, [obstacles, ballTopPos, topPos, gameStarted]);

	function startGame() {
		setGameStarted(true);
		setObstacles([]);
		setBallTopPos(window.innerHeight / 2);
		setVelocity(0);
	}

	return (
		<div
			className="game-container min-h-screen flex flex-col bg-cover bg-center"
			style={{ backgroundImage: `url(${bGImage})` }}
			onClick={jump}
		>
			<TopBar ref={topBarRef} title="Flappy Pet" />
			<DownBar ref={downBarRef} secondIcon={homeB()} />
			{!gameStarted && <GamePopup title={title} subtitle={subtitle} onStart={startGame} topBarSize={topPos} bottomPos={downBarOffset} />} {/* Render StartScreen if game hasn't started */}
			{gameStarted && (
				<>
					<Ball ref={ballRef} leftPos={ballLeftPos} top={ballTopPos} />
					{obstacles.map((obstacle, index) => (
						<Obstacle
							key={index}
							topPos={topPos}
							topHeight={obstacle.topHeight}
							bottomPos={obstacle.bottomPos}
							bottomHeight={window.innerHeight - downBarOffset - obstacle.bottomPos}
							left={obstacle.left}
							widthNum={obstRelativeWidth}
						/>
					))}
				</>
			)}
		</div>
	);
}

export default Game;
