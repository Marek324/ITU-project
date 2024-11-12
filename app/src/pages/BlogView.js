import React from 'react';
import AdoptHeader from 'components/AdoptHeader';
import ArticleTile from 'components/blog/ArticleTile';

const BlogView = ({articles}) => {
	return (
		<div className='bg-Main_BG'>
			<AdoptHeader />
			{/*body*/}
			{articles.map((article, index) => (
				<ArticleTile key={index} article={article} />
			))}

		</div>
	);
}

export default BlogView;
