import { useEffect, useState } from 'react';
import AdoptHeader from 'components/animals/AdoptHeader';
import Image from 'components/animals/Image';
import ChatController from 'controllers/ChatController';

const ArticleView = ({ article, adminMode, onDeleteClick, onUpdateClick}) => {
	const [articleTitle, setArticleTitle] = useState(article.title);
	const [articleAuthor, setArticleAuthor] = useState(article.author);
	const [articleContent, setArticleContent] = useState(article.content);
	const [articleImage, setArticleImage] = useState(article.image);

	useEffect(() => {
		setArticleTitle(article.title);
		setArticleAuthor(article.author);
		setArticleContent(article.content);
		setArticleImage(article.image);
	}, [article]);
	return (
		<div>
			<AdoptHeader />
			<div className='flex flex-col'>
				<div className='flex flex-rov justify-between'>
					<Image src={articleImage} alt={article.title} className='w-1/2' />
					<div className='flex flex-col justify-between'>
						<h1>{articleTitle}</h1>
						<h2>{articleAuthor}</h2>
						<p>{article.date}</p>
					</div>
				</div>
				<p>{articleContent}</p>
				<ChatController
					articleId={article.id}
					adminMode={adminMode}
				/>
			</div>
		</div>
	);
}

export default ArticleView;
