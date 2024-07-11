import { AuthContext } from '@/context/AuthProvider';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';

function MessageBubble({ message, nextMessageSender }) {
  const { auth } = useContext(AuthContext);

  return (
    <div
      className={`w-full flex pt-1 px-3 ${
        message?.sender === auth.user._id ? 'justify-end' : ''
      } ${nextMessageSender === message?.sender ? '!pt-[2px]' : ''}`}
    >
      <div
        className={`py-2 flex flex-wrap items-center gap-x-2 text-wrap w-max max-w-[600px] rounded-xl min-w-[72px] ${
          message?.sender === auth.user._id
            ? 'pl-2 pr-2 bg-blue-100 text-black rounded-tr-none'
            : 'pr-2 pl-2 bg-dark-blue text-white rounded-tl-none'
        } ${nextMessageSender === message?.sender ? '!rounded-xl' : ''}`}
      >
        <p className="text-sm hyphens-auto text-wrap h-max max-w-full break-words">
          {message?.content}
        </p>
        <span className="text-xs text-gray-600 ml-auto">
          {moment(message?.createdAt).format('LT').replace(' ', '')}
        </span>
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.object,
  nextMessageSender: PropTypes.string,
};

export default MessageBubble;
