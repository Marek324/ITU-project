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

	const [ballTopPos, setBallTopPos] = useState(window.innerHeight / 2);
	const [velocity, setVelocity] = useState(0);
	const [obstacles, setObstacles] = useState([]);
	const [topPos, setTopPos] = useState(0);
	const [downBarOffset, setBottomBarOffset] = useState(0);

	const topBarRef = useRef(null);
	const downBarRef = useRef(null);
	const ballRef = useRef(null);


	//Skok
	const jump = () => {
		setVelocity(-maxVelocity * 2.5);
	};


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
	}, [topBarRef]);


	//Fyzika
	useEffect(() => {
		if (topBarRef.current && (ballTopPos <= topPos)) {
			console.log("Kolize s horní částí");
			return setVelocity(0);
		}
		if (downBarRef.current && ballRef.current && (ballTopPos >= (window.innerHeight - downBarOffset - ballRef.current.clientHeight))) {
			console.log("Kolize s dolní částí");
			return setVelocity(0);
		}

		const interval = setInterval(() => {
			setVelocity((prevVelocity) => prevVelocity + gravity * timeInterval);

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
					return obstacle.left > -300;
				});
			});

		}, timeInterval * 100);

		return () => clearInterval(interval);
	}, [velocity, obstacles]);

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
	}, []);

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
			<TopBar ref={topBarRef} title="Flappy Pet" />
			<DownBar ref={downBarRef} secondIcon={homeB()} />
			<Ball ref={ballRef} top={ballTopPos} />
			{obstacles.map((obstacle, index) => (
				<Obstacle
					key={index}
					topPos={topPos}
					topHeight={obstacle.topHeight}
					bottomPos={obstacle.bottomPos}
					bottomHeight={window.innerHeight - downBarOffset - obstacle.bottomPos}
					left={obstacle.left}
				/>
			))}
		</div>
	);
}

export default Game;
