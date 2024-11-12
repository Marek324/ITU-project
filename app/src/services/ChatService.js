import axios from 'axios';
const port = 5000;

export async function GetChat(articleId) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/articles/${articleId}/chat`);

		return response.data;
	} catch (error) {
		console.error('Error fetching articles:', error);
		return [];
	}
}

export async function CreateMessage(articleId, message) {
	try {
		await axios.post(`http://localhost:${port}/api/articles/${articleId}/chat`, message);
	} catch (error) {
		console.error('Error creating article:', error);
	}
}

export async function DeleteMessage(articleId, id) {
	try {
		await axios.delete(`http://localhost:${port}/api/articles/${articleId}/chat/${id}`);
	} catch (error) {
		console.error('Error deleting article:', error);
	}
}
