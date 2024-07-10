import { useParams } from 'react-router-dom';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatHeader from './ChatHeader';
import { useContext, useEffect } from 'react';
import { ConversationContext } from '@/context/ConversationProvider';
import { AuthContext } from '@/context/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

function Chat() {
  const { chatState, dispatch, socketInstance } =
    useContext(ConversationContext);
  const { conversationId } = useParams();
  const { auth } = useContext(AuthContext);

  const userData = chatState.conversations
    .get(conversationId)
    ?.participants.filter(
      (participant) => participant._id !== auth.user._id
    )[0];
  const conversationData = chatState.conversationData.get(conversationId);

  const messagesQuery = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/conversations/${conversationId}/messages?${
          conversationData?.pageCursor
            ? `pageCursor=${conversationData.pageCursor}`
            : ''
        }`
      );
      return data;
    },
    enabled: !conversationData || conversationData.hasMore,
  });

  useEffect(() => {
    if (messagesQuery.status === 'success' && conversationData) {
      dispatch({
        type: 'UNSHIFT_CONVERSATION_DATA',
        value: {
          conversationId,
          messages: messagesQuery.data.messages,
          hasMore: messagesQuery.data.hasMore,
          pageCursor: messagesQuery.data.nextCursor,
        },
      });
    } else if (messagesQuery.status === 'success' && !conversationData) {
      dispatch({
        type: 'SET_CONVERSATION_DATA',
        value: {
          conversationId,
          messages: messagesQuery.data.messages,
          hasMore: messagesQuery.data.hasMore,
          pageCursor: messagesQuery.data.nextCursor,
        },
      });
    }
  }, [messagesQuery.data]);

  const onSend = (message) => {
    socketInstance.emit('send_message', message);
  };

  return (
    <>
      <ChatHeader userData={userData} />
      <ChatBody messages={conversationData?.messages} />
      <ChatFooter sendMessage={onSend} />
    </>
  );
}

export default Chat;
