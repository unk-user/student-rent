import { useParams } from 'react-router-dom';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatHeader from './ChatHeader';
import { useContext } from 'react';
import { ConversationContext } from '@/context/ConversationProvider';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { AuthContext } from '@/context/AuthProvider';

function Chat() {
  const { converstaions, conversationData } = useContext(ConversationContext);
  const { conversationId } = useParams();
  const { auth } = useContext(AuthContext);

  const userDataQuery = useQuery({
    queryKey: ['getUserData', conversationId],
    queryFn: async () => {
      const userId = converstaions
        .get(conversationId)
        .participants.filter((id) => id !== auth.user._id)[0];
      const { data } = axiosInstance.get(`/conversations/users/${userId}`);
      return data;
    },
    enabled: conversationData.get(conversationId)?.userData === null,
  });

  return (
    <>
      <ChatHeader />
      <ChatBody />
      <ChatFooter />
    </>
  );
}

export default Chat;
