import React, { useEffect, useRef, useState, useCallback } from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import { homeB, shop, leaderboard, game } from "../../svg";
import bGImage from "./Assets/bg.jpg";
import Ball from "./Ball.js";
import Obstacle from "./Obstacle";
import GamePopup from "./GamePopup";
import HighScores from "./HighScores";
import { GetFP, UpdateFP } from "../../services/FlappyPetService";
import ScoreCounter from "./ScoreCounter";

function Game() {
	const consts = {
		timeInterval: 10,
		gravity: 5,
		obstRelativeWidth: 5,
		ballLeftPos: 10
	};

	const [score, setScore] = useState(0);
	const [ballTopPos, setBallTopPos] = useState(window.innerHeight / 2);
	const [velocity, setVelocity] = useState(0);
	const [obstacles, setObstacles] = useState([]);
	const [topPos, setTopPos] = useState(0);
	const [downBarOffset, setBottomBarOffset] = useState(0);
	const [spawnInterval, setSpawnInterval] = useState(2000);
	const [gapSize, setGapSize] = useState(window.innerHeight * 0.28);
	const [obstSpeed, setObstSpeed] = useState(window.innerWidth * 0.0022);
	const [maxVelocity, setMaxVelocity] = useState(window.innerHeight * 0.0085);
	const [gameStarted, setGameStarted] = useState(false);
	const [title, setTitle] = useState('Flappy Pet');
	const [subtitle, setSubtitle] = useState('Start Game');
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showPopup, setShowPopup] = useState(true);
	const [passedObstacles, setPassedObstacles] = useState([]);

	//BE
	const [highScore, setHighScore] = useState(0);
	const [data, setData] = useState(null);

	const topBarRef = useRef(null);
	const downBarRef = useRef(null);
	const ballRef = useRef(null);

	useEffect(() => {
		GetFP(0).then((data) => {
			setHighScore(data.highscore);
			setData(data);
		});
	}, []);

	useEffect(() => {
		if (data) {
			setHighScore(data.highscore);
		}
	}, [data]);

	const jump = useCallback(() => {
		setVelocity(-maxVelocity * window.innerHeight * 0.003);
	}, [maxVelocity]);

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
			setVelocity((prevVelocity) => prevVelocity + consts.gravity * consts.timeInterval * 0.01 * window.innerHeight * 0.001);

			if (velocity > maxVelocity) {
				setVelocity(maxVelocity);
			}
			if (velocity < -maxVelocity) {
				setVelocity(-maxVelocity);
			}

			setBallTopPos(prevTop => prevTop + velocity + 0.5 * consts.gravity * Math.pow(consts.timeInterval * 0.01, 2));

			setObstacles(prevObstacles => {
				return prevObstacles.map((obstacle) => {
					obstacle.left -= obstSpeed;
					return obstacle;
				});
			});

			setObstacles(prevObstacles => {
				return prevObstacles.filter((obstacle) => {
					return obstacle.left > -consts.obstRelativeWidth * (window.innerWidth * 0.01);
				});
			});

		}, consts.timeInterval);

		return () => clearInterval(interval);
	}, [ballTopPos, gameStarted, velocity, obstacles, obstSpeed, passedObstacles]);

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

			for (let ob of obstacles) {
				const obWidth = consts.obstRelativeWidth * (window.innerWidth * 0.01);
				const obLeft = ob.left - (obWidth * 0.5);
				const obRight = ob.left + (obWidth * 0.5);

				const obTop = ob.topHeight + topPos;
				const obBottom = ob.bottomPos;

				const ballLeft = window.innerWidth * 0.01 * consts.ballLeftPos;
				const ballTopLeft = ballLeft - ballRef.current.clientWidth * 0.5;
				const ballTopRight = ballLeft + ballRef.current.clientWidth * 0.5;

				const ballTop = ballTopPos;
				const ballBottom = ballTopPos + ballRef.current.clientHeight;

				const horizontalOverlap = ballTopLeft <= obRight && ballTopRight >= obLeft;
				const verticalOverlap = ballTop <= obTop || ballBottom >= obBottom;

				if (horizontalOverlap && verticalOverlap) {
					stopGame();
					break;
				}
				else if (ballLeft > obRight && !passedObstacles.includes(ob)) {
					setPassedObstacles([...passedObstacles, ob]);
					setScore(score + 1);
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

	function UpdateHighScore() {
		data.highscore = score;
		UpdateFP(data.id, data).then(() => {
			setData(data);
		});
	}

	function stopGame() {
		setTitle('Game Over');
		setSubtitle('Restart Game');
		setGameStarted(false);
		setShowPopup(true);
		if (score > highScore) {
			UpdateHighScore();
		}
	}

	function startGame() {
		setGameStarted(true);
		setShowPopup(false);
		setObstacles([]);
		setBallTopPos(window.innerHeight / 2);
		setVelocity(0);
		setScore(0); // Reset score
		setPassedObstacles([]); // Reset passed obstacles
	}

	return (
		<div
			className="game-container min-h-screen flex flex-col bg-cover bg-center"
			style={{ backgroundImage: `url(${bGImage})` }}
		>
			<TopBar ref={topBarRef} title="Flappy Pet" />
			<DownBar ref={downBarRef} firstIcon={shop()} secondIcon={homeB()} thirdIcon={leaderboard()} onThirdClick={toggleLeaderboard} />
			{showPopup && <GamePopup title={title} subtitle={subtitle} topScore={highScore} onStart={startGame} topBarSize={topPos} bottomPos={downBarOffset} />}
			{gameStarted && (
				<>
					<ScoreCounter score={score} top={topPos}></ScoreCounter>
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
