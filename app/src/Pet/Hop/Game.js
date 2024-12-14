import React, { useState, useEffect, useRef } from "react";
import { getHighestScore, saveScore } from '../../services/HopService';
import Platform from "./Platform";
import bgImage from './Assets/bg.jpg'; // Import the background image
import playerImage from './Assets/pes.png'; // Import the player image

function GameHop() {
	const [platforms, setPlatforms] = useState([]);
	const [screenOffset, setScreenOffset] = useState(0);
	const [playerPosition, setPlayerPosition] = useState({
		top: 607, // Adjusted for the game container height
		left: 187.5, // Adjusted for the game container width
	});
	const [maxHeight, setMaxHeight] = useState(0);
	const [isJumping, setIsJumping] = useState(false);
	const [velocity, setVelocity] = useState(0);
	const [moveLeft, setMoveLeft] = useState(false);
	const [moveRight, setMoveRight] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [highestMaxHeight, setHighestMaxHeight] = useState(0);
	const [gameStarted, setGameStarted] = useState(false);
	const [hasFirstInput, setHasFirstInput] = useState(false);
	const playerRef = useRef(null);

	const gravity = 0.5;
	const jumpStrength = 10;
	const screenScrollThreshold = 333.5; // Adjusted for the game container height
	const moveSpeed = 15;

	const generatePlatform = (top, left) => {
		const width = 100 + Math.random() * 100;
		const height = 20;
		const moveDirection = Math.random() > 0.5 ? 1 : -1;

		return { top, left, width, height, moveDirection };
	};

	useEffect(() => {
		const numberOfPlatforms = Math.floor(375 / 70); // Adjusted for the game container width
		const initialPlatforms = [
			generatePlatform(647, 137.5), // Adjusted for the game container dimensions
			...Array.from({ length: numberOfPlatforms - 1 }, () => generatePlatform(Math.random() * 667, Math.random() * 375)), // Adjusted for the game container dimensions
		];
		setPlatforms(initialPlatforms);

		if (initialPlatforms.length > 0) {
			const firstPlatform = initialPlatforms[0];
			setPlayerPosition({
				top: firstPlatform.top - 20,
				left: firstPlatform.left + firstPlatform.width / 2 - 10,
			});
		}
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "ArrowLeft") {
				setMoveLeft(true);
				setHasFirstInput(true);
			} else if (event.key === "ArrowRight") {
				setMoveRight(true);
				setHasFirstInput(true);
			}
		};

		const handleKeyUp = (event) => {
			if (event.key === "ArrowLeft") {
				setMoveLeft(false);
			} else if (event.key === "ArrowRight") {
				setMoveRight(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useEffect(() => {
		if (!gameStarted || gameOver) return;

		const gameLoop = setInterval(() => {
			if (!hasFirstInput) return;

			setPlayerPosition((prevPosition) => {
				let newTop = prevPosition.top + velocity;
				let newLeft = prevPosition.left;

				if (moveLeft) {
					newLeft -= moveSpeed;
				}
				if (moveRight) {
					newLeft += moveSpeed;
				}

				if (newTop >= 647 && !isJumping) {
					setGameOver(true);
					return prevPosition;
				}

				if (newTop < screenScrollThreshold) {
					setScreenOffset(prevOffset => {
						const diff = screenScrollThreshold - newTop;
						const newOffset = prevOffset + diff;
						setMaxHeight(Math.floor(newOffset));
						return newOffset;
					});
					newTop = screenScrollThreshold;
				}

				return { top: newTop, left: newLeft };
			});

			setVelocity((prevVelocity) => {
				if (prevVelocity < 0) {
					setIsJumping(true);
				} else if (prevVelocity > 0 && isJumping) {
					setIsJumping(false);
				}
				return prevVelocity + gravity;
			});

			if (velocity < 0) { // Only move platforms when player is moving up
				setPlatforms((prevPlatforms) => {
					const newPlatforms = prevPlatforms
						.map((platform) => ({
							...platform,
							top: platform.top + 20,
						}))
						.filter((platform) => platform.top < 667); // Adjusted for the game container height

					if (newPlatforms.length < Math.floor(667 / 100)) { // Adjusted for the game container height
						const newPlatform = generatePlatform(0, Math.random() * 375); // Adjusted for the game container width
						return [...newPlatforms, newPlatform];
					}

					return newPlatforms;
				});
			}

			checkCollision();
		}, 30);

		return () => clearInterval(gameLoop);
	}, [velocity, screenOffset, moveLeft, moveRight, isJumping, gameStarted, gameOver, hasFirstInput]);

	useEffect(() => {
		if (gameOver) {
			postMaxHeight(maxHeight);
			fetchHighestMaxHeight();
		}
	}, [gameOver]);

	useEffect(() => {
		fetchHighestMaxHeight();
	}, []);

	const checkCollision = () => {
		if (!playerRef.current) return;

		for (let platform of platforms) {
			const playerBottom = playerPosition.top + 80; // Adjusted for the new player size
			const playerRight = playerPosition.left + 80; // Adjusted for the new player size
			const platformTop = platform.top;
			const platformBottom = platform.top + platform.height;
			const platformRight = platform.left + platform.width;

			if (
				playerBottom >= platformTop &&
				playerPosition.top < platformBottom &&
				playerPosition.left < platformRight &&
				playerRight > platform.left &&
				velocity > 0
			) {
				setVelocity(-jumpStrength);
				setIsJumping(true);
				setMaxHeight((prevMaxHeight) => Math.max(prevMaxHeight, 667 - playerPosition.top + screenOffset)); // Adjusted for the game container height
			}
		}
	};

	const fetchHighestMaxHeight = async () => {
		const highestScore = await getHighestScore();
		setHighestMaxHeight(highestScore.height);
	};

	const postMaxHeight = async (maxHeight) => {
		const response = await saveScore(maxHeight);
		if (response) {
			console.log('Max height saved successfully:', response);
		}
	};

	const startGame = () => {
		setGameStarted(true);
		setGameOver(false);
		setMaxHeight(0);
		setVelocity(0);
		setScreenOffset(0);
		setHasFirstInput(false);
		setPlayerPosition({
			top: 607,
			left: 187.5,
		});
	};

	return (
		<div
			className="outer-container"
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				backgroundColor: "#2A2356",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				className="game-container"
				style={{
					position: "relative",
					width: "375px",
					height: "667px",
					backgroundImage: `url(${bgImage})`,
					backgroundSize: "cover",
					overflow: "hidden",
				}}
			>
				{gameStarted ? (
					<>
						{platforms.map((platform, index) => (
							<Platform
								key={index}
								top={platform.top - screenOffset}
								left={platform.left}
								width={platform.width}
								height={platform.height}
							/>
						))}
						<div
							ref={playerRef}
							style={{
								position: "absolute",
								top: `${playerPosition.top - screenOffset}px`,
								left: `${playerPosition.left}px`,
								width: "80px", // Adjusted for the new player size
								height: "80px", // Adjusted for the new player size
								backgroundImage: `url(${playerImage})`,
								backgroundSize: "cover",
							}}
						/>
						<div
							style={{
								position: "absolute",
								top: "10px",
								right: "10px",
								fontSize: "20px",
								color: "black",
							}}
						>
							Height: {maxHeight}
						</div>
						{gameOver && (
							<div
								style={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									backgroundColor: "white",
									padding: "20px",
									border: "2px solid black",
									textAlign: "center",
									color: "black",
								}}
							>
								<h1>Game Over</h1>
								<p>Height Reached: {maxHeight}</p>
								<p>Highest Max Height: {highestMaxHeight}</p>
								<button onClick={() => window.location.reload()}>Restart</button>
							</div>
						)}
					</>
				) : (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							backgroundColor: "white",
							padding: "20px",
							border: "2px solid black",
							textAlign: "center",
							color: "black",
						}}
					>
						<h1>Welcome to GameHop</h1>
						<p>Highest Max Height: {highestMaxHeight}</p>
						<button onClick={startGame}>Start Game</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default GameHop;
