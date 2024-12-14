import React from 'react';

const HighScores = ({scores, topBar, downBar}) => {
	return (
		<div className="absolute left-0 right-0 flex items-center justify-center z-1000"
			 style={{top: topBar, bottom: downBar, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
			<div className="bg-Pet_Header_BG p-5 rounded-lg text-center ">
				<h2 className="text-Pet_Text text-pet font-Pet_Title text-2xl mb-2"
					style={{textShadow: '2px 2px 0 black', marginTop: '-10px'}}>High Scores</h2>
				<ul>
					{scores.map((score, index) => (
						<li key={index} className="text-subtext text-sm" style={{textShadow: '2px 2px 0 black'}}>
							{score.name}: <span className="text-yellow-500">{score.score}</span>
							<hr className="my-2 border-black"/>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default HighScores;
