import axios from 'axios';
const port = 5000;

export async function DeleteFP(id) {
	try {
		const response = await axios.delete(`http://localhost:${port}/api/fp/${id}`);
		console.log(response.data);
	} catch (error) {
		console.error('Error deleting games:', error);
	}
}

export async function GetFPs() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/fp`);
		return response.data.map(fp => ({
			id: fp.id,
			highscore: fp.highscore,
			leaderboards: fp.leaderboards,
			boughtColors: fp.boughtColors
		}));
	}
	catch (error) {
		console.error('Error fetching games:', error);
		return [];
	}
}

export async function GetFP(id) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/fp/${id}`);
		const fp = response.data;
		return {
			id: fp.id,
			highscore: fp.highScore,
			leaderboards: fp.leaderboards,
			boughtColors: fp.boughtColors
		}
	} catch (error) {
		console.error('Error fetching game:', error);
		return null;
	}
}

export async function UpdateFP(id, fp) {
	try {
		const response = await axios.put(`http://localhost:${port}/api/fp/${id}`, fp);
		console.log(response.data.highscore);
		return response.data;
	} catch (error) {
		console.error('Error updating game:', error);
	}
}
