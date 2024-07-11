import propTypes from 'prop-types';
import MessageBubble from './MessageBubble';

function ChatBody({ messages }) {
  
  return (
    <div className="w-full flex-1 flex flex-col-reverse bg-white z-10 mt-14 overflow-y-auto">
      {messages
        ? messages.map((message, index) => (
            <MessageBubble
              key={message?._id}
              message={message}
              nextMessageSender={messages[index + 1]?.sender}
            />
          ))
        : ''}
    </div>
  );
}

ChatBody.propTypes = {
  messages: propTypes.array,
};

export default ChatBody;
