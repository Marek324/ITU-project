import React from 'react';

function GamePopup({ onStart, topBarSize, bottomPos, title, subtitle }) {
	return (
		<div
			style={{
				position: 'absolute',
				top: topBarSize,
				bottom: bottomPos,
				left: '0',
				right: '0',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: '1000',
			}}
			>
			<div
				style={{
					backgroundColor: 'white',
					padding: '20px',
					borderRadius: '10px',
					textAlign: 'center',
				}}
			>
				<h1
					style={{
						fontSize: '2.5rem',
						fontWeight: 'bold',
						color: '#333',
						marginBottom: '20px',
					}}
				>{title}</h1>

				<button
					style={{
						padding: '10px 20px',
						backgroundColor: 'green',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
					}}
					onClick={onStart}>{subtitle}</button>
			</div>
		</div>
	);
}

export default GamePopup;
