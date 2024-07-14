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
  const [participantsStatus, setParticipantsStatus] = useState(null);
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
            conversationData: {
              ...state.conversationData,
              [action.value.conversationId]: {
                messages: [action.value],
                hasMore: false,
                pageCursor: null,
              },
            },
            conversations: new Map([
              ...state.conversations,
              [
                action.value.conversationId,
                {
                  ...state.conversations.get(action.value.conversationId),
                  newMessagesCount:
                    action.value.sender !== auth.user._id
                      ? [{ count: 1 }]
                      : [{ count: 0 }],
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
        case 'NEW_MESSAGE':
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
                  newMessagesCount:
                    action.value.sender !== auth.user._id
                      ? [
                          {
                            count:
                              state.conversations.get(
                                action.value.conversationId
                              ).newMessagesCount[0].count++ || 1,
                          },
                        ]
                      : [{ count: 0 }],
                },
              ],
            ]),
            conversationData: {
              ...state.conversationData,
              [action.value.conversationId]: {
                messages: state.conversationData[action.value.conversationId]
                  ? [
                      action.value,
                      ...state.conversationData[action.value.conversationId]
                        .messages,
                    ]
                  : [action.value],
                hasMore: state.conversationData[action.value.conversationId]
                  ? state.conversationData[action.value.conversationId].hasMore
                  : true,
                pageCursor:
                  state.conversationData[action.value.conversationId]
                    ?.pageCursor || action.value._id,
              },
            },
          };
        case 'MARK_CONVERSATION_AS_READ':
          return {
            ...state,
            conversations: new Map([
              ...state.conversations,
              [
                action.value.conversationId,
                {
                  ...state.conversations.get(action.value.conversationId),
                  newMessagesCount: [{ count: 0 }],
                },
              ],
            ]),
          };
      }
    },
    {
      conversations: new Map(),
      conversationData: {},
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
        setOnlineState(true);
        console.log('userid:', auth.user._id);
        socket.emit('send_status', {
          status: 'online',
          userId: auth.user._id,
        });
      });

      socket.on('disconnect', () => {
        setOnlineState(false);
        socket.emit('send_status', {
          status: 'offline',
          userId: auth.user._id,
        });

        setTimeout(() => {
          socket.connect();
        }, 5000);
      });

      socket.on('new_conversation', ({ conversation, message }) => {
        dispatch({
          type: 'NEW_CONVERSATION',
          value: conversation,
        });
        dispatch({
          type: 'NEW_CONVERSATION_MESSAGE',
          value: message,
        });
      });

      socket.on('status_update', ({ status, conversationId, userId }) => {
        setParticipantsStatus((prev) => {
          if (!prev && conversationId) {
            return { [userId]: status };
          } else if (prev && conversationId) {
            return {
              ...prev,
              [userId]: status,
            };
          } else if (prev && !conversationId) {
            return prev[userId] ? { ...prev, [userId]: status } : prev;
          }
        });
      });

      socket.on('conversations_status', (participantStatuses) => {
        console.log(participantStatuses);
        setParticipantsStatus((prev) => {
          const newStatus = prev || {};

          participantStatuses.forEach((conversation) => {
            if (conversation)
              newStatus[conversation.userId] = conversation.status;
          });

          return newStatus;
        });
      });

      socket.on('new_message', ({ message }) => {
        dispatch({
          type: 'NEW_MESSAGE',
          value: message,
        });
      });

      socket.on('mark_conversation_as_read', (conversationId) => {
        dispatch({
          type: 'MARK_CONVERSATION_AS_READ',
          value: { conversationId },
        });
      });

      const checkConnectionStatus = () => {
        socket.emit('ping');

        const timeout = setTimeout(() => {
          setOnlineState(false);
        }, 5000);

        socket.on('pong', () => {
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
  }, [auth]);

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
      socketInstance.emit(
        'join_conversations',
        conversationQuery?.data.map((conversation) => conversation._id)
      );
      dispatch({
        type: 'SET_CONVERSATIONS',
        value: conversationQuery.data,
      });
    }

    return () => {
      if (conversationQuery.status === 'success') {
        socketInstance.emit(
          'leave_conversations',
          conversationQuery?.data.map((conversation) => conversation._id)
        );
      }
    };
  }, [conversationQuery.data]);

  return (
    <ConversationContext.Provider
      value={{
        chatState,
        dispatch,
        onlineState,
        socketInstance,
        participantsStatus,
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
