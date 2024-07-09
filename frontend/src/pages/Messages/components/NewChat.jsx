import { useNavigate, useParams } from 'react-router-dom';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatHeader from './ChatHeader';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { useContext, useEffect } from 'react';
import { ConversationContext } from '@/context/ConversationProvider';

function NewChat() {
  const { userId } = useParams();
  const { socketInstance, conversations } = useContext(ConversationContext);
  const navigate = useNavigate();

  const userDataQuery = useQuery({
    queryKey: ['getUserData', userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/conversations/users/${userId}`
      );
      return data;
    },
  });

  useEffect(() => {
    const conversation = Array.from(conversations.values()).find((conv) =>
      conv.participants.includes(userId)
    );

    if (conversation) {
      navigate(`/tenant/messages/${conversation._id}`);
    }
  }, [conversations]);

  const sendMessages = (message) => {
    socketInstance.emit('send_message_new', {
      content: message,
      receiverId: userId,
    });
  };

  if (userDataQuery.status === 'success')
    return (
      <>
        <ChatHeader userData={userDataQuery.data} />
        <ChatBody />
        <ChatFooter sendMessages={sendMessages} />
      </>
    );
}

export default NewChat;
