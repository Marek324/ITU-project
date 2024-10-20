import React, {useEffect, useState} from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import {homeB} from "../../svg";

function Game() {
	//Handle scroll

	//Event na skákání
	const jump = () =>
	{
		alert("jump");
	};

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
			style={{ backgroundImage: `url('https://i.postimg.cc/JznxpgQY/itukoza.jpg')` }}
			onClick={jump}
		>
			<TopBar
				title="Flappy Pet"
			/>

			<DownBar
				secondIcon={homeB()}
			/>
		</div>
	);
}
export default Game;
