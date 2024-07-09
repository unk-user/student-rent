import propTypes from 'prop-types';

function ChatBody({ messages }) {
  return (
    <div className="w-full flex-1 flex flex-col-reverse bg-white z-10">
      {messages
        ? messages.map((message, index) => (
            <div key={index}>{message.content}</div>
          ))
        : ''}
    </div>
  );
}

ChatBody.propTypes = {
  messages: propTypes.array,
};

export default ChatBody;
