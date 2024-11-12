import { useState } from 'react';
import AdoptHeader from 'components/animals/AdoptHeader';
import ArticleTile from 'components/blog/ArticleTile';
import { add as add_icon } from 'svg';

const BlogView = ({articles, adminMode, onAdminModeClick, onDeleteClick, onSave}) => {
	const [add, setAdd] = useState(false);

	//inputs
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [content, setContent] = useState('');
	const [image, setImage] = useState('');


	const handleSaveClick = () => {
		if (title && author && content && image) {
			setTitle('');
			setAuthor('');
			setContent('');
			setImage('');
			setAdd(false);
			onSave({title, author, content, image});
		}
	}

	return (
		<div className='App bg-Main_BG'>
			<AdoptHeader onAdminModeClick={onAdminModeClick} />
			{articles.map((article, index) => (
				<ArticleTile key={index} article={article} adminMode={adminMode} onDeleteClick={onDeleteClick} />
			))}
			{adminMode && <button onClick={() => setAdd(true)} className="bg-green-500 text-white p-2 rounded-lg">{add_icon()}</button>}

			{add &&
				<div>
					<input type="text" placeholder="Title"  value={title} onChange={(e) => setTitle(e.target.value)} />
					<input type="text" placeholder="Author"  value={author} onChange={(e) => setAuthor(e.target.value)} />
					<input type="text" placeholder="Content"  value={content} onChange={(e) => setContent(e.target.value)} />
					<input type="text" placeholder="Image"  value={image} onChange={(e) => setImage(e.target.value)} />
					<button onClick={() => setAdd(false)}>Cancel</button>
					<button onClick={() => handleSaveClick()}>Save</button>
				</div>
			}
		</div>
	);
}

export default BlogView;
