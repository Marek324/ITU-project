import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleView from 'pages/ArticleView';
import { GetArticle, DeleteArticle, UpdateArticle } from 'services/BlogService';
import { useLocation } from 'react-router-dom';

const ArticleController = () => {
	const { id } = useParams();
	const location = useLocation();	
	const [article, setArticle] = useState({});
	const [adminMode, setAdminMode] = useState(location.state?.adminMode || false);

	const fetch = async () => {
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
		fetch();
	};

	const handleUpdate = async (newArticleData) => {
		await UpdateArticle(id, newArticleData);
		fetch();
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
	<ArticleView
		article={article}
		adminMode={adminMode}
		onAdminModeClick={toggleAdminMode}
		onDeleteClick={handleDeleteClick}
		onUpdateClick={handleUpdate}
	/>
);
}

export default ArticleController;
