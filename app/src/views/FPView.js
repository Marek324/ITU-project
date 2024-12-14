import React from 'react';
import DownBar from '../Pet/components/DownBar.js';
import TopBar from '../Pet/components/TopBar.js';
import GamePopup from '../Pet/FlappyBird/GamePopup';
import Ball from '../Pet/FlappyBird/Ball';
import Obstacle from '../Pet/FlappyBird/Obstacle';
import ScoreCounter from '../Pet/FlappyBird/ScoreCounter';
import HighScores from '../Pet/FlappyBird/HighScores';
import bGImage from '../Pet/FlappyBird/Assets/bg.jpg';
import {homeB, leaderboard, shop} from "../svg";
import Shop from "../Pet/FlappyBird/Shop";
import {useParams} from "react-router-dom";

const GameView = ({
					  gameStarted, showPopup, title, subtitle, highScore, startGame, topPos, downBarOffset,
					  obstacles, ballTopPos, consts, ballRef, score, showLeaderboard, toggleLeaderboard,
					  topBarRef, downBarRef, scores, toggleShop, showShop, colors, currentColor, coins, onColorBuy,
					  onColorSelect
				  }) => {

	//Gettting animal id from the url
	const {id} = useParams();

	//Function to get the filter for colloring the ball
	const getFilter = (color) => {
		switch (color) {
			case 'Pink':
				return 'sepia(1) hue-rotate(200deg) saturate(100)';
			case 'Green':
				return 'sepia(1) hue-rotate(50deg) saturate(100)';
			case 'Blue':
				return 'sepia(1) hue-rotate(100deg) saturate(100)';
			case 'Yellow':
				return 'sepia(1) saturate(100)';
			case 'Cyan':
				return 'sepia(1) saturate(100) hue-rotate(150deg)';
			case 'Grey':
				return 'grayscale(1) brightness(0.5)';
			default:
				return;
		}
	};

	return (
		<div className="game-container min-h-screen flex flex-col bg-cover bg-center"
			 style={{backgroundImage: `url(${bGImage})`}}>

			<TopBar ref={topBarRef} title="Flappy Pet"/>

			<DownBar ref={downBarRef} firstIcon={leaderboard()} secondIcon={shop()}
					 onFirstClick={toggleLeaderboard} onSecondClick={toggleShop} linkBack={`/animal/${id}/tamagotchi`}/>

			{showPopup && <GamePopup title={title} subtitle={subtitle} topScore={highScore} onStart={startGame}
									 topBarSize={topPos} bottomPos={downBarOffset}/>}

			{gameStarted && (
				<>
					<Ball ref={ballRef} leftPos={consts.ballLeftPos} top={ballTopPos}
						  filter={getFilter(currentColor)}/>
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
					<ScoreCounter score={score} top={topPos}></ScoreCounter>
				</>
			)}

			{showLeaderboard &&
				<HighScores scores={scores} topBar={topPos}
							downBar={downBarOffset}/>}

			{showShop &&
				<Shop colors={colors} topBar={topPos} downBar={downBarOffset} currentColor={currentColor} coins={coins}
					  onColorBuy={onColorBuy} onColorSelect={onColorSelect}></Shop>}

		</div>
	);
};

export default GameView;
