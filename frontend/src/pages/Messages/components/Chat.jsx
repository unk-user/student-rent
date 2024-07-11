import { useParams } from 'react-router-dom';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatHeader from './ChatHeader';
import { useContext, useEffect } from 'react';
import { ConversationContext } from '@/context/ConversationProvider';
import { AuthContext } from '@/context/AuthProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

function Chat() {
  const { chatState, socketInstance } = useContext(ConversationContext);
  const { conversationId } = useParams();
  const { auth } = useContext(AuthContext);

  const userData = chatState.conversations
    .get(conversationId)
    ?.participants.filter(
      (participant) => participant._id !== auth.user._id
    )[0];
  const conversationData = chatState.conversationData[conversationId];

  const messagesQuery = useInfiniteQuery({
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
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore) return undefined;
      return lastPage.nextCursor;
    },
    initialPageParam: conversationData?.pageCursor || undefined,
  });

  useEffect(() => {
    if (messagesQuery.status === 'success') {
      socketInstance?.emit('read_message', conversationId);
    }
  }, [messagesQuery.status]);

  const onSend = (message) => {
    socketInstance.emit('send_message', {
      conversationId,
      content: message,
      sender: auth.user._id,
    });
  };

  const messages = conversationData
    ? conversationData.messages.concat(
        messagesQuery.data?.pages.map((page) => page.messages).flat()
      )
    : messagesQuery.data?.pages.map((page) => page.messages).flat();

  return (
    <>
      <ChatHeader userData={userData} />
      <ChatBody messages={messages} />
      <ChatFooter sendMessage={onSend} />
    </>
  );
}

export default Chat;
