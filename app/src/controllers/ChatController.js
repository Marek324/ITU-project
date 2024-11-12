import { useState, useEffect } from 'react';
import { CreateMessage, GetMessages, DeleteMessage } from "services/ChatService";
import Chat from 'components/chat/Chat';

const ChatController = ({adminMode}) => {
	const articleId = { id } = useParams();


	const [messages, setMessages] = useState([]);

	const fetchMessages= async () => {
		try {
			const fetchedMessages = await GetMessages(articleId);
			setMessages(fetchedMessages);
		} catch (error) {
			console.error('Error fetching chat:', error);
		}
	};

	const handleDeleteClick = async (id) =>  {
		await DeleteMessage(articleId, id);
		fetchMessages();
	};

	const handleSave = async (newMessage) => {
		await CreateMessage(articleId, newMessage);
		fetchMessages();
	};

	useEffect(() => {
		const timer = setTimeout(() => {
		  fetchMessages();
		}, 2000);

		return () => {
		  clearTimeout(timer);
		};
	  }, []);

	return (
		<Chat
			messages={messages}
			adminMode={adminMode}
			onDeleteClick={handleDeleteClick}
			onSave={handleSave}

		/>
	);
}

export default ChatController;
