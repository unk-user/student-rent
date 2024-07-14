import { useParams } from 'react-router-dom';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatHeader from './ChatHeader';
import { useContext } from 'react';
import { ConversationContext } from '@/context/ConversationProvider';
import { AuthContext } from '@/context/AuthProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

function Chat() {
  const { chatState, socketInstance } = useContext(ConversationContext);
  const { conversationId } = useParams();
  const { auth } = useContext(AuthContext);

  const userData = chatState.conversations?.get(conversationId)
    ? chatState.conversations
        .get(conversationId)
        ?.participants?.filter(
          (participant) => participant._id !== auth.user._id
        )[0]
    : null;
  const conversationData = chatState.conversationData[conversationId];

  const messagesQuery = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam }) => {
      if (conversationData && !conversationData.hasMore)
        throw new Error('fresh conversation');
      const { data } = await axiosInstance.get(
        `/conversations/${conversationId}/messages?${
          pageParam ? 'pageCursor=' + pageParam : ''
        }`
      );
      return data;
    },
    enabled: !conversationData || conversationData.hasMore,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore) return null;
      return lastPage.nextCursor;
    },
    initialPageParam: conversationData?.pageCursor || null,
  });

  const onSend = (message) => {
    socketInstance.emit('send_message', {
      conversationId,
      content: message,
      sender: auth.user._id,
    });
  };

  const messages = conversationData
    ? conversationData.messages.concat(
        messagesQuery.data?.pages.map((page) => page.messages).flat() || []
      )
    : messagesQuery.data?.pages.map((page) => page.messages).flat();

  return (
    <>
      <ChatHeader userData={userData} />
      <ChatBody
        messages={messages}
        conversationId={conversationId}
        fetchNextPage={messagesQuery.fetchNextPage}
      />
      <ChatFooter sendMessage={onSend} />
    </>
  );
}

export default Chat;
