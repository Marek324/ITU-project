import { useState, useEffect } from 'react';
import { CreateArticle, GetArticles, DeleteArticle } from "services/BlogService";
import BlogView from 'pages/BlogView';

const BlogController = () => {
	const [articles, setArticles] = useState([]);
	const [adminMode, setAdminMode] = useState(false);

	const fetchArticles = async () => {
		try {
			const fetchedArticles = await GetArticles();
			setArticles(fetchedArticles);
		} catch (error) {
			console.error('Error fetching articles:', error);
		}
	};

	const toggleAdminMode = () => setAdminMode(prevAdminMode => !prevAdminMode);

	const handleDeleteClick = async (id) =>  {
		await DeleteArticle(id);
		fetchArticles();
	};

	const handleSave = async (newArticle) => {
		await CreateArticle(newArticle);
		fetchArticles();
	};

	useEffect(() => {
		fetchArticles();
	}, []);

	return (
		<BlogView
			articles={articles}
			adminMode={adminMode}
			onAdminModeClick={toggleAdminMode}
			onDeleteClick={handleDeleteClick}
			onSave={handleSave}

		/>
	);
}

export default BlogController;
