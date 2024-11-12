import { useState }	from 'react';

const ChatMessage = ({message, adminMode, onDeleteClick}) => {
	return (
		<div className='flex flex-row'>
			<p>{message.author}:</p>
			<p>{message.content}</p>
			{adminMode && <button onClick={() => onDeleteClick(message.id)}>Delete</button>}
		</div>
	)
};

export default ChatMessage;
