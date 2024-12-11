import React from 'react';
import DownBar from '../Pet/components/DownBar.js';
import TopBar from '../Pet/components/TopBar.js';
import GamePopup from '../Pet/FlappyBird/GamePopup';
import Ball from '../Pet/FlappyBird/Ball';
import Obstacle from '../Pet/FlappyBird/Obstacle';
import ScoreCounter from '../Pet/FlappyBird/ScoreCounter';
import HighScores from '../Pet/FlappyBird/HighScores';
import bGImage from './Assets/bg.jpg';
import {homeB, leaderboard, shop} from "../svg";

const GameView = ({ gameStarted, showPopup, title, subtitle, highScore, startGame, topPos, downBarOffset, obstacles, ballTopPos, consts, ballRef, score, showLeaderboard, toggleLeaderboard }) => {
	return (
		<div className="game-container min-h-screen flex flex-col bg-cover bg-center" style={{backgroundImage: `url(${bGImage})`}}>

			<TopBar ref={topPos} title="Flappy Pet"/>

			<DownBar ref={downBarOffset} firstIcon={shop()} secondIcon={homeB()} thirdIcon={leaderboard()}
					 onThirdClick={toggleLeaderboard}/>

			{showPopup && <GamePopup title={title} subtitle={subtitle} topScore={highScore} onStart={startGame}
									 topBarSize={topPos} bottomPos={downBarOffset}/>}

			{gameStarted && (
				<>
					<Ball ref={ballRef} leftPos={consts.ballLeftPos} top={ballTopPos}/>
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
				<HighScores scores={[{name: 'Player 1', points: 10}, {name: 'Player 2', points: 20}]} topBar={topPos}
							downBar={downBarOffset}/>}

		</div>
	);
};

export default GameView;
