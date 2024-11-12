import React, { useEffect, useParams } from 'react';
import ArticleView from 'pages/ArticleView';

const ArticleController = () => {
	const { id } = useParams();

	return <ArticleView />;
}

export default ArticleController;
