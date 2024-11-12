import { useState } from 'react';
import ChatMessage from 'components/chat/ChatMessage';

const Chat = ({messages, adminMode, onDeleteClick, onSave}) => {
	const [allowChat, setAllowChat] = useState(false);

	//inputs
	const [author, setAuthor] = useState('');
	const [message, setMessage] = useState('');

	const handleSaveClick = () => {
		if (author && message) {
			setMessage('');
			onSave({ author, message });
		}
	}

	return (
		<div className='bg-Main_BG flex flex-col'>
			<div className='flex flex-col items-center scroll-smooth'>
				{messages.map((message, index) => (
					<ChatMessage key={index} message={message} adminMode={adminMode} onDeleteClick={onDeleteClick} />
				))};
			</div>
			<div className='flex flex-row items-center'>
				<input type="text" placeholder="Author"  value={author} onChange={(e) => setAuthor(e.target.value)} />
				<input type="text" placeholder="Message"  value={message} onChange={(e) => setMessage(e.target.value)} />
				<button onClick={() => handleSaveClick}>Send</button>
			</div>
		</div>
	);
}



export default Chat;
