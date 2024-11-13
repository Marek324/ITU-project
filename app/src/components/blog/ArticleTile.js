import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'components/animals/Image';

const ArticleTile = ({ article, adminMode }) => {
	return (
		<div className="flex flex-row items-center justify-center">
			<Link to={`/blog/${article.id}`} state={{adminMode}} className="flex flex-row items-center justify-center bg-white p-4 m-4 rounded-lg shadow-md">
				<Image src={article.image} alt={article.title} className="w-32 h-32 object-cover rounded-lg" />
				<div className="flex flex-col items-center justify-center">
					<h2 className="text-2xl font-bold text-gray-800">{article.title}</h2>
					<p className="text-gray-600">{article.content.substring(0, 50)}</p>
				</div>
			</Link>
		</div>
	);
}

export default ArticleTile;
