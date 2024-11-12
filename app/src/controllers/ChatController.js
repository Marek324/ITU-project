import { useState, useEffect } from 'react';
import { CreateMessage, GetChat, DeleteMessage } from "services/ChatService";
import Chat from 'components/chat/ChatView';

const ChatController = ({ articleId, adminMode} ) => {


	const [messages, setMessages] = useState({ messages: [] });

	const fetchMessages= async () => {
		try {
			const fetchedMessages = await GetChat(articleId);
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
		fetchMessages();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
		  fetchMessages();
		}, 2000);

		return () => clearTimeout(timer);
	  }, []);

	return (
		<Chat
			messages={messages.messages}
			adminMode={adminMode}
			onDeleteClick={handleDeleteClick}
			onSave={handleSave}

		/>
	);
}

export default ChatController;
