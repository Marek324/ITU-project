import { useState, useEffect } from 'react';
import { GetArticles } from "services/BlogService";
import BlogView from 'pages/BlogView';

const BlogController = () => {
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		async function fetchArticles() {
			const fetchedArticles = await GetArticles();
			setArticles(fetchedArticles);
		}
		fetchArticles();
	}, []);

	return <BlogView articles={articles} />;
}

export default BlogController;
