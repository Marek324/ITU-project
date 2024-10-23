import React, { useEffect, useRef, useState } from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import { homeB } from "../../svg";
import bGImage from "./Assets/bg.jpg";
import Ball from "./Ball.js";
import Obstacle from "./Obstacle";

function Game() {
	const gravity = 6;
	const timeInterval = 0.167;
	const maxVelocity = 15;

	const [ballTopPos, setBallTopPos] = useState(window.innerHeight / 2);
	const [velocity, setVelocity] = useState(0);
	const [obstaclePos, setObstaclePos] = useState(window.innerWidth);
	const [topPos, setTopPos] = useState(0);
	const [downBarOffset, setBottomBarOffset] = useState(0);

	const topBarRef = useRef(null);
	const downBarRef = useRef(null);

	const jump = () => {
		setVelocity(-maxVelocity * 2.5);
	};

	//Nastavit topPos překážky
	useEffect(() => {
		if (topBarRef.current){
			setTopPos(topBarRef.current.clientHeight);
		}
		if (downBarRef.current){
			setBottomBarOffset(downBarRef.current.clientHeight);
		}
	}, [topBarRef]);


	useEffect(() => {
		if (topBarRef.current && (ballTopPos <= topBarRef.current.clientHeight)) {
			console.log("Kolize s horní částí");
			return setVelocity(0);
		}
		if (downBarRef.current && (ballTopPos >= (window.innerHeight - downBarRef.current.clientHeight * 2))) {
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

			setBallTopPos((prevTop) => prevTop + velocity + 0.5 * gravity * Math.pow(timeInterval, 2));

			setObstaclePos((prevPos) => prevPos - 5);

		}, timeInterval * 100);

		return () => clearInterval(interval);
	}, [velocity]);

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
			<Ball top={ballTopPos} />
			<Obstacle topPos={topPos} topHeight={topPos + 100} bottomPos={600} bottomHeight={downBarOffset} left={obstaclePos} />
		</div>
	);
}

export default Game;
