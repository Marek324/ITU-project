import React, {useEffect, useRef, useState} from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import {homeB} from "../../svg";
import Ball from "./Ball.js";

function Game() {
	//Handle scroll

	//Normálně je gravitační konstanta 9.8, ale to není dost rychlé
	const gravity = 30;

	//Interval, který odpovídá +- 60fps
	const timeInterval = 0.167;

	//Maximální vertikální rychlost
	const maxVelocity = 100;

	//Pozice míčku
	const [ballTopPos, setBallTopPos] = useState(window.innerHeight / 2);

	//Rychlost míčku
	const [velocity, setVelocity] = useState(0);

	const topBarRef = useRef(null);
	const downBarRef = useRef(null);

	//Event na skákání
	const jump = () =>
	{
		setVelocity(-maxVelocity);
	};

	//Fyzika
	useEffect(() => {

		//Konotrola kolize s horní a dolní částí
		if (topBarRef.current && (ballTopPos <= topBarRef.current.clientHeight))
		{
			console.log("Kolize s horní částí");
			return setVelocity(0);
		}
		if (downBarRef.current && (ballTopPos >= (window.innerHeight - downBarRef.current.clientHeight * 2)))
		{
			console.log("Kolize s dolní částí");
			return setVelocity(0);
		}

		const interval = setInterval(() => {
			setVelocity((prevVelocity) => prevVelocity + gravity * timeInterval);

			//Limitování rychlosti
			if (velocity > maxVelocity) {
				setVelocity(maxVelocity);
			}
			if (velocity < -maxVelocity) {
				setVelocity(-maxVelocity);
			}

			setBallTopPos((prevTop) => prevTop + velocity * timeInterval + 0.5 * gravity * Math.pow(timeInterval, 2));




			}, timeInterval * 100);

		return () => clearInterval(interval);
	}, [velocity]);

	//Reagování na stisk klávesy
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
			style={{ backgroundImage: `url('https://i.postimg.cc/KvTcp7RK/image.jpg')` }}
			onClick={jump}
		>
			<TopBar ref={topBarRef} title="Flappy Pet" />
			<DownBar ref={downBarRef} secondIcon={homeB()} />
			<Ball top={ballTopPos} />
		</div>
	);
}
export default Game;
