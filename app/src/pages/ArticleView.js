import { useState } from 'react';
import AdoptHeader from 'components/animals/AdoptHeader';
import Image from 'components/Image';
import ChatController from 'controllers/ChatController';

const ArticleView = ({ article, adminMode, onDeleteClick, onUpdateClick}) => {
	console.log(article);
	const [articleTitle, setArticleTitle] = useState(article.title);
	const [articleAuthor, setArticleAuthor] = useState(article.author);
	const [articleContent, setArticleContent] = useState(article.content);
	const [articleImage, setArticleImage] = useState(article.image);
	return (
		<div>
			<AdoptHeader />
			<div className='flex flex-col'>
				<div className='flex flex-rov justify-between'>
					<Image src={article.image} alt={article.title} className='w-1/2' />
					<div className='flex flex-col justify-between'>
						<h1>{articleTitle}</h1>
						<h2>{article.author}</h2>
						<p>{article.date}</p>
					</div>
				</div>
				<p>{article.content}</p>
				<ChatController
					articleId={article.id}
					adminMode={adminMode}
				/>
			</div>
		</div>
	);
}

export default ArticleView;
