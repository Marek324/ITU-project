//Author: Lukáš Píšek (xpisek02)
//File: FlappyPetService.js
//Description: Service for getting and updating flappy pet tables

import axios from 'axios';

const port = 5000;

//Getting a flappy pet table by id
export async function GetFP(id) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/fp/${id}`);
		const fp = response.data;
		return {
			id: fp.id,
			highscore: fp.highscore,
			leaderboards: fp.leaderboards,
			boughtColors: fp.boughtColors
		}
	} catch (error) {
		console.error('Error fetching game:', error);
		return null;
	}
}

//Updating a flappy pet table
export async function UpdateFP(id, fp) {
	try {
		await axios.put(`http://localhost:${port}/api/fp/${id}`, fp);
	} catch (error) {
		console.error('Error updating fp:', error);
	}
}

//Updating colors of a pet
export async function UpdatePetColors(id, colors) {
	try {
		const response = await axios.put(`http://localhost:${port}/api/fp/${id}/colors`, colors);
		return response.data;
	} catch (error) {
		console.error('Error updating pet colors:', error);
	}
}
