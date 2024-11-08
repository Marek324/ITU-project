import React from 'react';

function AnimalFilterWindow({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-4 rounded shadow-lg w-1/2 relative">
				<button className="absolute top-2 right-2" onClick={onClose}>X</button>
				{children}
			</div>
		</div>
	);
}

export default AnimalFilterWindow;
