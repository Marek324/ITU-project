import axios from 'axios';
const port = 5000;

export async function GetImageNames() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/images`);
		console.log(response);
		return response.data;
	} catch (error) {
		console.error('Error fetching images:', error);
		return [];
	}
}
