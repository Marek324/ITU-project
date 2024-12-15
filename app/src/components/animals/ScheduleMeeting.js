//Author: Tobiáš Adamčík (xadamc08)
//File: ScheduleMeeting.js
//Description: Modal for scheduling a meeting with an animal

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CreateMeeting } from '../../services/MeetingsService';
import 'index.css'; // Import the CSS file

function ScheduleMeeting({ isOpen, onClose, animalId }) {
	const [dateVar, setDateVar] = useState('');
	const [timeVar, setTimeVar] = useState('');

	// Clear the date and time input fields when the modal is opened
	useEffect(() => {
		if (isOpen) {
			setDateVar('');
			setTimeVar('');
		}
	}, [isOpen]);

	// Handle the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Combine the date and time into a single Date object
		const date = new Date(`${dateVar}T${timeVar}`);
		await CreateMeeting({ animalId: Number(animalId), date });
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-2xl mb-4 text-Main_Header">Schedule a Meeting</h2>
			<form onSubmit={handleSubmit} className="flex flex-col items-center">
				<div className="mb-4 w-full">
					<label className="block text-Main_Header">Date</label>
					<input
						type="date"
						className="w-full p-2 border rounded bg-Main_BG focus:outline-none focus:ring-2 focus:ring-Main_Header_Border date-time-input"
						value={dateVar}
						onChange={(e) => setDateVar(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4 w-full">
					<label className="block text-Main_Header">Time</label>
					<input
						type="time"
						className="w-full p-2 border rounded bg-Main_BG focus:outline-none focus:ring-2 focus:ring-Main_Header_Border date-time-input"
						value={timeVar}
						onChange={(e) => setTimeVar(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="submit-button bg-Main_Header text-Main_BG font-bold text-2xl align-middle text-border-smaller" style={{ width: '150px' }}>
					Schedule
				</button>
			</form>
		</Modal>
	);
}

export default ScheduleMeeting;
