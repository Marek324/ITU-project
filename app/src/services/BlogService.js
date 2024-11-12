import axios from 'axios';
const port = 5000;

export async function GetArticles() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/articles`);
		return response.data.map(article => ({
			id: article.id,
			title: article.title,
			author: article.author,
			date: article.date,
			content: article.content,
			description: article.content.substring(0, 50),
			image: article.image
		}));
	} catch (error) {
		console.error('Error fetching articles:', error);
		return [];
	}
}

export async function GetArticle(id) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/articles/${id}`);
		const article = response.data;
		return {
			id: article.id,
			title: article.title,
			author: article.author,
			date: article.date,
			content: article.content,
			description: article.content.substring(0, 50),
			image: article.image
		}
		} catch (error) {
			console.error('Error fetching articles:', error);
			return null;
		}
}
