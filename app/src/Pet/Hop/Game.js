import React, { useState, useEffect, useRef } from "react";
import Platform from "./Platform";

function GameHop() {
	const [platforms, setPlatforms] = useState([]);
	const [screenOffset, setScreenOffset] = useState(0);
	const [playerPosition, setPlayerPosition] = useState({
		top: window.innerHeight - 60,
		left: window.innerWidth / 2,
	});
	const [maxHeight, setMaxHeight] = useState(0);
	const [isJumping, setIsJumping] = useState(false);
	const [velocity, setVelocity] = useState(0);
	const [moveLeft, setMoveLeft] = useState(false);
	const [moveRight, setMoveRight] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const playerRef = useRef(null);

	const gravity = 0.5;
	const jumpStrength = 10;
	const screenScrollThreshold = window.innerHeight / 2;
	const moveSpeed = 15;

	const generatePlatform = (top, left) => {
		const width = 100 + Math.random() * 100;
		const height = 20;
		const moveDirection = Math.random() > 0.5 ? 1 : -1;

		return { top, left, width, height, moveDirection };
	};

	useEffect(() => {
		const initialPlatforms = [
			generatePlatform(window.innerHeight - 20, window.innerWidth / 2 - 50),
			...Array.from({ length: 9 }, () => generatePlatform(Math.random() * window.innerHeight, Math.random() * window.innerWidth)),
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
			} else if (event.key === "ArrowRight") {
				setMoveRight(true);
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
		const gameLoop = setInterval(() => {
			setPlayerPosition((prevPosition) => {
				let newTop = prevPosition.top + velocity;
				let newVelocity = velocity + gravity;
				let newLeft = prevPosition.left;

				if (moveLeft) {
					newLeft -= moveSpeed;
				}
				if (moveRight) {
					newLeft += moveSpeed;
				}

				if (newTop > window.innerHeight - 20) {
					newTop = window.innerHeight - 20;
					newVelocity = 0;
					setIsJumping(false);
					setGameOver(true); // End the game
				}

				if (newTop < screenScrollThreshold) {
					setScreenOffset((prevOffset) => prevOffset + (screenScrollThreshold - newTop));
					setMaxHeight((prevMaxHeight) =>
						Math.max(prevMaxHeight, window.innerHeight - newTop + screenOffset)
					);
					newTop = screenScrollThreshold;
				}

				return { ...prevPosition, top: newTop, left: newLeft };
			});

			setVelocity((prevVelocity) => prevVelocity + gravity);

			if (velocity < 0) { // Only move platforms when player is moving up
				setPlatforms((prevPlatforms) => {
					const newPlatforms = prevPlatforms
						.map((platform) => ({
							...platform,
							top: platform.top + 20,
						}))
						.filter((platform) => platform.top < window.innerHeight);

					if (newPlatforms.length < 10) {
						const newPlatform = generatePlatform(0, Math.random() * window.innerWidth);
						return [...newPlatforms, newPlatform];
					}

					return newPlatforms;
				});
			}

			checkCollision();
		}, 30);

		return () => clearInterval(gameLoop);
	}, [velocity, screenOffset, moveLeft, moveRight]);

	const checkCollision = () => {
		if (!playerRef.current) return;

		for (let platform of platforms) {
			const playerBottom = playerPosition.top + 20;
			const playerRight = playerPosition.left + 20;
			const platformBottom = platform.top + platform.height;
			const platformRight = platform.left + platform.width;

			if (
				playerPosition.top < platformBottom &&
				playerBottom > platform.top &&
				playerPosition.left < platformRight &&
				playerRight > platform.left &&
				velocity > 0
			) {
				setVelocity(-jumpStrength);
				setIsJumping(true);
			}
		}
	};

	return (
		<div
			className="game-screen"
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				backgroundColor: "lightblue",
				overflow: "hidden",
			}}
		>
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
					width: "20px",
					height: "20px",
					backgroundColor: "red",
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
					}}
				>
					<h1>Game Over</h1>
					<p>Height Reached: {maxHeight}</p>
					<button onClick={() => window.location.reload()}>Restart</button>
				</div>
			)}
		</div>
	);
}

export default GameHop;
