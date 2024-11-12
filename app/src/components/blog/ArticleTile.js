import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'components/Image';

const ArticleTile = ({key, article}) => {
	return (
		<Link to={`/blog/${article.id}`} className="flex flex-row items-center justify-center bg-white p-4 m-4 rounded-lg shadow-md">
			<Image src={article.image} alt={article.title} className="w-32 h-32 object-cover rounded-lg" />
			<div className="flex flex-col items-center justify-center">
				<h2 className="text-2xl font-bold text-gray-800">{article.title}</h2>
				<p className="text-gray-600">{article.description}</p>
			</div>
		</Link>
	);
}

export default ArticleTile;
