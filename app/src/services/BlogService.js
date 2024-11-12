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
			image: article.image
		}
		} catch (error) {
			console.error('Error fetching articles:', error);
			return null;
		}
}

export async function CreateArticle(article) {
	try {
		await axios.post(`http://localhost:${port}/api/articles`, article);
	} catch (error) {
		console.error('Error creating article:', error);
	}
}

export async function UpdateArticle(id, article) {
	try {
		await axios.put(`http://localhost:${port}/api/articles/${id}`, article);
	} catch (error) {
		console.error('Error updating article:', error);
	}
}


export async function DeleteArticle(id) {
	try {
		await axios.delete(`http://localhost:${port}/api/articles/${id}`);
	} catch (error) {
		console.error('Error deleting article:', error);
	}
}
