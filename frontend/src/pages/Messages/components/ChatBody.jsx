import propTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthProvider';
import { ConversationContext } from '@/context/ConversationProvider';
import { useInView } from 'react-intersection-observer';

function ChatBody({ messages, conversationId, fetchNextPage }) {
  const { auth } = useContext(AuthContext);
  const { socketInstance } = useContext(ConversationContext);
  const { ref: lastMsgRef, inView } = useInView({});
  const { ref: topRef, inView: inTopView } = useInView({});
  const lastMessage = messages?.length > 0 ? messages[0] : null;

  useEffect(() => {
    const messageContainer = document.getElementById('messagesContainer');
    if (messageContainer && lastMessage) {
      if (lastMessage?.sender === auth?.user?._id) {
        messageContainer.scrollTo({
          top: messageContainer.scrollHeight + 100,
          behavior: 'auto',
        });
      }
    }
  }, [lastMessage, auth?.user?._id]);

  useEffect(() => {
    if (lastMessage?.sender !== auth?.user?._id && inView) {
      socketInstance.emit('read_message', conversationId);
    }
  }, [inView, lastMessage]);

  useEffect(() => {
    if (inTopView && fetchNextPage) {
      fetchNextPage();
    }
  }, [inTopView]);

  return (
    <div
      id="messagesContainer"
      className="w-full flex-1 flex flex-col-reverse bg-white z-10 mt-14 overflow-y-auto py-4"
    >
      {messages
        ? messages.map((message, index) => {
            return index == 0 ? (
              <div ref={lastMsgRef} key={message?._id}>
                <MessageBubble
                  message={message}
                  nextMessageSender={messages[index + 1]?.sender}
                />
              </div>
            ) : (
              <MessageBubble
                key={message?._id}
                message={message}
                nextMessageSender={messages[index + 1]?.sender}
              />
            );
          })
        : ''}
      <span ref={topRef} className="w-full h-12 bg-gray-600 invisible">
        scroll intersection
      </span>
    </div>
  );
}

ChatBody.propTypes = {
  messages: propTypes.array,
  conversationId: propTypes.string,
  fetchNextPage: propTypes.func,
};

export default ChatBody;
