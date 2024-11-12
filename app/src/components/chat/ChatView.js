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
		<div className='bg-Main_BG'>
			{messages.map((message, index) => (
				<ChatMessage key={index} message={message} adminMode={adminMode} onDeleteClick={onDeleteClick} />
			))}
		</div>
	);
}

export default Chat;
