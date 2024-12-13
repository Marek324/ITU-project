import axios from 'axios';
import {DeleteFP} from './FlappyPetService.js';

const port = 5000;

export async function DeleteGame(id) {
	try {
		let data = await GetGame(id);
		if (data.fpId !== null) {
			await DeleteFP(data.fpId);
		}

		await axios.delete(`http://localhost:${port}/api/games/${id}`);

	} catch (error) {
		console.error('Error deleting games:', error);
	}

}

export async function GetGames() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/games`);
		return response.data.map(game => ({
			id: game.id,
			animalId: game.animalId,
			money: game.money,
			fpId: game.fpId,
			//Tady si dejte další hry
		}));
	} catch (error) {
		console.error('Error fetching games:', error);
		return [];
	}
}

export async function GetGame(gameId) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/games/${gameId}`);
		const game = response.data;
		return {
			id: game.id,
			animalId: game.animalId,
			money: game.money,
			fpId: game.fpId,
			//Tady si dejte další hry
		}
	} catch (error) {
		console.error('Error fetching game:', error);
		return null;
	}
}

export async function GetMoney(id) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/pet/${id}/money`);
		return response.data.money;
	} catch (error) {
		console.error('Error fetching money:', error);
		return null;
	}
}

export async function UpdatePetMoney(id, money) {
	try {
		const response = await axios.put(`http://localhost:${port}/api/pet/${id}/money`, {money});
		return response.data;
	} catch (error) {
		console.error('Error updating pet money:', error);
		return null;
	}
}
