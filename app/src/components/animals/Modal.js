// File: src/components/animals/Modal.js

import React from 'react';

function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-lg relative">
				<button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
				{children}
			</div>
		</div>
	);
}

export default Modal;
