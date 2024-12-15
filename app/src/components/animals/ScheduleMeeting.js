import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CreateMeeting } from '../../services/MeetingsService';
import {UpdatePetMoney} from "../../services/GameService";

function ScheduleMeeting({ isOpen, onClose, animalId }) {
	const [dateVar, setDateVar] = useState('');
	const [timeVar, setTimeVar] = useState('');

	useEffect(() => {
		if (isOpen) {
			setDateVar('');
			setTimeVar('');
		}
	}, [isOpen]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const date = new Date(`${dateVar}T${timeVar}`);
		await CreateMeeting({ animalId: Number(animalId), date });
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-2xl mb-4">Schedule a Meeting</h2>
			<form onSubmit={handleSubmit} className="flex flex-col items-center">
				<div className="mb-4 w-full">
					<label className="block text-gray-700">Date</label>
					<input
						type="date"
						className="w-full p-2 border rounded"
						value={dateVar}
						onChange={(e) => setDateVar(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4 w-full">
					<label className="block text-gray-700">Time</label>
					<input
						type="time"
						className="w-full p-2 border rounded"
						value={timeVar}
						onChange={(e) => setTimeVar(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="submit-button text-Main_BG font-bold text-2xl align-middle text-border-smaller" style={{ width: '150px' }}>
					Schedule
				</button>
			</form>
		</Modal>
	);
}

export default ScheduleMeeting;
