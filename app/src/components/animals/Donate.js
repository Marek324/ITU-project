//Author: Tobiáš Adamčík (xadamc08)
//File: Donate.js
//Description: Modal for donating money to the shelter

import React, { useState } from 'react';

function DonateModal({ isOpen, onClose, handleDonate }) {
	const [amount, setAmount] = useState(0);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg shadow-lg relative">
				<button onClick={() => {
					onClose();
					setAmount(0);
				}} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
					&times;
				</button>
				<h2 className="text-2xl mb-4">Donate Money</h2>
				<input
					type="number"
					placeholder="Amount"
					className="border p-2 mb-4 w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-Main_Header_Border"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
				/>
				<div className="flex justify-center">
					<button onClick={() => { handleDonate(amount); setAmount(0); }} className="donate-button text-Main_BG font-bold text-2xl align-middle text-border-smaller">
						Donate
					</button>
				</div>
			</div>
		</div>
	);
}

export default DonateModal;
