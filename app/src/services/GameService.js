//Author: Lukáš Píšek (xpisek02)
//File: GameService.js
//Description: Service for getting and updating money of a pet


import axios from 'axios';

const port = 5000;

//Getting money of a pet
export async function GetMoney(id) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/animal/${id}/money`);
		return response.data.money;
	} catch (error) {
		console.error('Error fetching money:', error);
		return null;
	}
}

//Updating money of a pet
export async function UpdatePetMoney(id, money) {
	try {
		const response = await axios.put(`http://localhost:${port}/api/animal/${id}/money`, {money});
		return response.data;
	} catch (error) {
		console.error('Error updating pet money:', error);
		return null;
	}
}
