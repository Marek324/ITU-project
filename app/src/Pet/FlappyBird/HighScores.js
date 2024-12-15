//Author: Lukáš Píšek (xpisek02)
//File: HighScores.js
//Description: Component for displaying high scores

import React from 'react';

//Leaderboard component
const HighScores = ({scores, topBar, downBar}) => {
	return (
		<div className="absolute left-0 right-0 flex items-center justify-center z-1000"
			 style={{top: topBar, bottom: downBar, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
			<div className="bg-Pet_Header_BG p-5 rounded-lg text-center ">

				{/*Title*/}
				<h2 className="text-Pet_Text text-pet font-Pet_Title text-2xl mb-2"
					style={{textShadow: '2px 2px 0 black', marginTop: '-10px'}}>High Scores</h2>
				<ul>

					{/*Iterating through scores and displaying them*/}
					{scores.map((score, index) => (
						<li key={index} className="text-subtext text-sm flex justify-between items-center"
							style={{textShadow: '2px 2px 0 black'}}>
							<span className="flex-1 text-left">{score.name}</span>
							<hr className="my-2 border-black w-full mx-2"/>
							<span className="flex-1 text-right text-yellow-500">{score.score}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default HighScores;
