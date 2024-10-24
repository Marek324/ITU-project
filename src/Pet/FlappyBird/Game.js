import React, { useEffect, useRef, useState } from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import { homeB } from "../../svg";
import bGImage from "./Assets/bg.jpg";
import Ball from "./Ball.js";
import Obstacle from "./Obstacle";

function Game() {
	const gravity = 5;
	const timeInterval = 0.1;
	const maxVelocity = 10;
	const obstacleSpawnInterval = 1800;
	const gapSize = 350;
	const obstRelativeWidth = 5;
	const ballLeftPos = 10;

	const [ballTopPos, setBallTopPos] = useState(window.innerHeight / 2);
	const [velocity, setVelocity] = useState(0);
	const [obstacles, setObstacles] = useState([]);
	const [topPos, setTopPos] = useState(0);
	const [downBarOffset, setBottomBarOffset] = useState(0);
	const [collision, setCollision] = useState(false);

	const topBarRef = useRef(null);
	const downBarRef = useRef(null);
	const ballRef = useRef(null);


	//Vypnutí scrollbaru
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);


	//Nastavit topPos překážky
	useEffect(() => {
		if (topBarRef.current){
			setTopPos(topBarRef.current.clientHeight);
		}
		if (downBarRef.current){
			setBottomBarOffset(downBarRef.current.clientHeight);
		}
	}, []);


	//Fyzika
	useEffect(() => {
		if (collision) return;

		if (topBarRef.current && (ballTopPos <= topPos)) {
			setCollision(true);
			return;
		}
		if (downBarRef.current && ballRef.current && (ballTopPos >= (window.innerHeight - downBarOffset - ballRef.current.clientHeight))) {
			setCollision(true);
			return;
		}

		const interval = setInterval(() => {

			//Nastavení rychlosti míčku
			setVelocity((prevVelocity) => prevVelocity + gravity * timeInterval);

			//Limitace rychlosti míčku
			if (velocity > maxVelocity) {
				setVelocity(maxVelocity);
			}
			if (velocity < -maxVelocity) {
				setVelocity(-maxVelocity);
			}

			//Nastavení pozice míčku
			setBallTopPos((prevTop) => prevTop + velocity + 0.5 * gravity * Math.pow(timeInterval, 2));

			//Pohyb překážek
			setObstacles(prevObstacles => {
				return prevObstacles.map((obstacle) => {
					obstacle.left -= 3;
					return obstacle;
				})
			});

			//Odstranění nepotřebných překážek
			setObstacles(prevObstacles => {
				return prevObstacles.filter((obstacle) => {
					return obstacle.left > -obstRelativeWidth * (window.innerWidth * 0.01);
				});
			});

		}, timeInterval * 100);

		return () => clearInterval(interval);
	}, [velocity, obstacles, ballTopPos, downBarOffset, topPos, collision]);

	//Generování překážek
	useEffect(() => {
		const interval = setInterval(() => {
			const topHeight = Math.floor(Math.random() * (window.innerHeight - downBarOffset - gapSize - 50));
			const bottomPos = topHeight + gapSize;
			const left = window.innerWidth;

			setObstacles(prevObstacles => {
				return [...prevObstacles, {topPos: topPos, topHeight: topHeight, bottomPos: bottomPos, bottomHeight: window.innerHeight - downBarOffset - bottomPos, left: left}];
			});

		}, obstacleSpawnInterval);

		return () => clearInterval(interval);
	}, [downBarOffset, topPos]);

	//Kontrola kolize s překážkou
	//Možná předělat na kruh boundary
	useEffect(() => {
		if (collision) return;
		const checkCollision = () => {
			if (!ballRef.current) {
				return;
			}

			for (let ob of obstacles) {
				//Horizontální
				const obWidth = obstRelativeWidth * (window.innerWidth * 0.01);
				const obLeft = ob.left - (obWidth * 0.5);
				const obRight = ob.left + (obWidth * 0.5);

				//Vertikální
				const obTop = ob.topHeight + topPos;
				const obBottom = ob.bottomPos;

				//Horizontální
				const ballLeft = window.innerWidth * 0.01 * ballLeftPos;
				const ballTopLeft = ballLeft - ballRef.current.clientWidth * 0.5;
				const ballTopRight = ballLeft + ballRef.current.clientWidth * 0.5;

				//Vertikální
				const ballTop = ballTopPos;
				const ballBottom = ballTopPos + ballRef.current.clientHeight;

				const horizontalOverlap = ballTopLeft <= obRight && ballTopRight >= obLeft;
				const verticalOverlap = ballTop <= obTop || ballBottom >= obBottom;

				if (horizontalOverlap && verticalOverlap) {
					console.log("kolize")
					setCollision(true);
				}
			}
		}

		const interval = setInterval(checkCollision, timeInterval * 100);
		return () => clearInterval(interval);

	}, [obstacles, ballTopPos, topPos, collision]);


	//Skok
	const jump = () => {
		setVelocity(-maxVelocity * 2.5);
	};

	//Event na skok
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.code === 'Space' || event.code === 'ArrowUp') {
				jump();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div
			className="game-container min-h-screen flex flex-col bg-cover bg-center"
			style={{ backgroundImage: `url(${bGImage})` }}
			onClick={jump}
		>
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
			<TopBar ref={topBarRef} title="Flappy Pet" />
			<DownBar ref={downBarRef} secondIcon={homeB()} />
		</div>
	);
}

export default Game;
