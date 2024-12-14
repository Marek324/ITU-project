import React from 'react';

function ScoreDisplay({ score, top }) {
	return (
		<div style={{ position: 'absolute', top: top, left: '10px', color: '#B957CE', textShadow: '2px 2px 0 black' }}
			 className="text-[#B957CE] text-pet text-2xl">
			Score: <span className="text-yellow-500" style={{ textShadow: '2px 2px 0 black' }}>{score}</span>
		</div>
	);
}

export default ScoreDisplay;
