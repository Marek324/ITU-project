//Author: Tobiáš Adamčík (xadamc08)
//File: MeetingsService.js
//Description: Service for managing meetings with animals in the shelter

import axios from 'axios';
const port = 5000;

export async function GetMeetings() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/meetings`);
		return mapMeetings(response);

	} catch (error) {
		console.error('Error fetching meetings:', error);
		return [];
	}
}

function mapMeetings(response) {
	return response.data.map(meeting => ({
		id: meeting.id,
		animal: {
			id: meeting.animalId,
			name: meeting.animal.name,
			image: meeting.animal.image
		},
		date: meeting.date,
	}));
}

export async function CreateMeeting(Meeting) {
	try {
		const response = await axios.post(`http://localhost:${port}/api/meetings`, Meeting);
	} catch (error) {
		console.error('Error adding meeting:', error);
	}
}

export async function RemoveMeeting(id) {
	const response = await axios.delete(`http://localhost:${port}/api/meetings/${id}`);
}
