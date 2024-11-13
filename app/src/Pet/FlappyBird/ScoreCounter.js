import React from 'react';

function ScoreDisplay({ score, top }) {
	return (
		<div style={{ position: 'absolute', top: top, right: '10px', fontSize: '24px', color: 'white' }}>
			Score: {score}
		</div>
	);
}

export default ScoreDisplay;
