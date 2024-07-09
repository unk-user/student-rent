import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthProvider';
import io from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export const ConversationContext = createContext(null);

function ConversationProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const [conversations, setConversations] = useState(new Map());
  const [conversationData, setConversationData] = useState(new Map());
  const [onlineState, setOnlineState] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (auth?.accessToken) {
      const socket = io(import.meta.env.REACT_APP_API_URI.replace('/api', ''), {
        query: { accessToken: auth?.accessToken },
        transports: ['websocket'],
      });

      setSocketInstance(socket);

      socket.on('connect', () => {
        console.log('Connected to socket server');
        setOnlineState(true);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setOnlineState(false);

        setTimeout(() => {
          socket.connect();
        }, 5000);
      });

      socket.on('new_conversation', (conversation) => {
        setConversations((prevConversations) => {
          prevConversations.set(conversation._id, conversation);
          return new Map(prevConversations);
        });
      });

      socket.on('new_message', (message) => {
        console.log('new_message', message);
        setConversationData((prevConversationData) => {
          prevConversationData.set(message.conversationId, {
            message,
            userData: null,
          });
        });
      });

      const checkConnectionStatus = () => {
        socket.emit('ping');
        console.log('ping');

        const timeout = setTimeout(() => {
          console.log('Connection issue detected. Disconnecting...');
          setOnlineState(false);
        }, 5000);

        socket.on('pong', () => {
          console.log('Connection is active');
          setOnlineState(true);
          clearTimeout(timeout);
        });
      };

      const interval = setInterval(checkConnectionStatus, 10000);

      return () => {
        clearInterval(interval);
        if (socket) {
          socket.disconnect();
          setOnlineState(false);
        }
      };
    }
  }, [auth?.accessToken]);

  const conversationQuery = useQuery({
    queryKey: ['get_conversations'],
    enabled: !!auth?.accessToken,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/conversations');
      return data;
    },
  });

  useEffect(() => {
    if (conversationQuery.status === 'success') {
      setConversations(new Map(conversationQuery.data.map((c) => [c._id, c])));
    }
  }, [conversationQuery.status]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        setConversations,
        onlineState,
        socketInstance,
        conversationData,
        setConversationData,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

ConversationProvider.propTypes = {
  children: PropTypes.node,
};

export default ConversationProvider;
