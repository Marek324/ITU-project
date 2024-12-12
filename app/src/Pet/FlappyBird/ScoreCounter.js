import React from 'react';

function ScoreDisplay({ score, top }) {
	return (
		<div style={{ position: 'absolute', top: top, left: '10px', color: '#B957CE'}}
			 className="text-[#B957CE] text-pet text-2xl">
			Score: {score}
		</div>
	);
}

export default ScoreDisplay;
