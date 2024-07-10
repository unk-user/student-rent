import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthProvider';
import io from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export const ConversationContext = createContext(null);

function ConversationProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const [onlineState, setOnlineState] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);
  const [chatState, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'NEW_CONVERSATION':
          return {
            ...state,
            conversations: new Map([
              ...state.conversations,
              [action.value._id, action.value],
            ]),
          };
        case 'NEW_CONVERSATION_MESSAGE':
          return {
            ...state,
            conversations: new Map([
              ...state.conversations,
              [
                action.value.conversationId,
                {
                  ...state.conversations.get(action.value.conversationId),
                  lastMessage: {
                    sender: action.value.sender,
                    content: action.value.content,
                    createdAt: action.value.createdAt,
                  },
                },
              ],
            ]),
            conversationData: new Map([
              ...state.conversationData,
              [
                action.value.conversationId,
                {
                  messages: [action.value],
                  hasMore: false,
                  pageCursor: action.value._id,
                },
              ],
            ]),
          };
        case 'SET_CONVERSATIONS':
          return {
            ...state,
            conversations: new Map(
              action.value.map((conversation) => [
                conversation._id,
                conversation,
              ])
            ),
          };
        case 'SET_CONVERSATION_DATA':
          return {
            ...state,
            conversationData: new Map([
              ...state.conversationData,
              [
                action.value.conversationId,
                {
                  messages: action.value.messages,
                  hasMore: action.value.hasMore,
                  pageCursor: action.value.pageCursor,
                },
              ],
            ]),
          };
        case 'UNSHIFT_CONVERSATION_DATA':
          return {
            ...state,
            conversationData: new Map([
              ...state.conversationData,
              [
                action.value.conversationId,
                {
                  messages: [
                    action.value.messages,
                    ...state.conversationData.get(action.value.conversationId)
                      .messages,
                  ],
                  hasMore: action.value.hasMore,
                  pageCursor: action.value.pageCursor,
                },
              ],
            ]),
          };
      }
    },
    {
      conversations: new Map(),
      conversationData: new Map(),
    }
  );

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
        console.log('new_conversation', conversation);
        dispatch({
          type: 'NEW_CONVERSATION',
          value: conversation,
        });
      });

      socket.on('new_conversation_message', (message) => {
        console.log('new_conversation_message', message);
        dispatch({
          type: 'NEW_CONVERSATION_MESSAGE',
          value: message,
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
      dispatch({
        type: 'SET_CONVERSATIONS',
        value: conversationQuery.data,
      });
    }
  }, [conversationQuery.data]);

  return (
    <ConversationContext.Provider
      value={{
        chatState,
        dispatch,
        onlineState,
        socketInstance,
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
