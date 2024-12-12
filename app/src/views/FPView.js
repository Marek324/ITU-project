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

const GameView = ({ gameStarted, showPopup, title, subtitle, highScore, startGame, topPos, downBarOffset, obstacles, ballTopPos, consts, ballRef, score, showLeaderboard, toggleLeaderboard, topBarRef, downBarRef, scores, toggleShop, showShop }) => {
	return (
		<div className="game-container min-h-screen flex flex-col bg-cover bg-center" style={{backgroundImage: `url(${bGImage})`}}>

			<TopBar ref={topBarRef} title="Flappy Pet"/>

			<DownBar ref={downBarRef} firstIcon={leaderboard()} secondIcon={homeB()} thirdIcon={shop()}
					 onFirstClick={toggleLeaderboard} onThirdClick={toggleShop}/>

			{showPopup && <GamePopup title={title} subtitle={subtitle} topScore={highScore} onStart={startGame}
									 topBarSize={topPos} bottomPos={downBarOffset}/>}

			{gameStarted && (
				<>
					<Ball ref={ballRef} leftPos={consts.ballLeftPos} top={ballTopPos} filter="sepia(1) saturate(5) hue-rotate(200deg)" />
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
				<Shop ></Shop>}

		</div>
	);
};

export default GameView;
