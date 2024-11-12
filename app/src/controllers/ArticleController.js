import { useState, useEffect, useParams } from 'react';
import ArticleView from 'pages/ArticleView';
import { GetArticle, DeleteArticle, UpdateArticle } from 'services/BlogService';

const ArticleController = () => {
	const { id } = useParams();

	const [article, setArticle] = useState({});
	const [adminMode, setAdminMode] = useState(false);

	const fetchArticle = async () => {
		try {
			const fetchedArticle = await GetArticle(id);
			setArticle(fetchedArticle);
		} catch (error) {
			console.error('Error fetching articles:', error);
		}
	};

	const toggleAdminMode = () => setAdminMode(prevAdminMode => !prevAdminMode);

	const handleDeleteClick = async (id) =>  {
		await DeleteArticle(id);
		fetchArticle();
	};

	const handleUpdate = async (newArticleData) => {
		await UpdateArticle(id, newArticleData);
		fetchArticle();
	};

	useEffect(() => {
		fetchArticle();
	}, []);

	return <ArticleView
		article={article}
		adminMode={adminMode}
		onAdminModeClick={toggleAdminMode}
		onDeleteClick={handleDeleteClick}
		onUpdateClick={handleUpdate}
	/>;
}

export default ArticleController;
