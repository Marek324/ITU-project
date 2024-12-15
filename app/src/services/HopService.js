// app/src/services/GameService.js
import axios from 'axios';

const port = 5000;
const baseURL = `http://localhost:${port}/api/hop`;

export async function getScores(difficulty) {
	try {
		const response = await axios.get(`${baseURL}/scores/${difficulty}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching scores:', error);
		return [];
	}
}

export async function getHighestScore(difficulty) {
	try {
		const response = await axios.get(`${baseURL}/highest/${difficulty}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching highest score:', error);
		return null;
	}
}

export async function saveScore(maxHeight, difficulty) {
	try {
		const response = await axios.post(baseURL, { maxHeight, difficulty });
		return response.data;
	} catch (error) {
		console.error('Error saving score:', error);
		return null;
	}
}
