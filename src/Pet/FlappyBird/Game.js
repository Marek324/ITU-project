import React, { useState } from 'react';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import {homeB} from "../../svg";

function Game() {
	return (
		<div
			className="game-container min-h-screen flex flex-col bg-cover bg-center"
			style={{ backgroundImage: `url('https://i.postimg.cc/JznxpgQY/itukoza.jpg')` }}
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
