import { AuthContext } from '@/context/AuthProvider';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';

function MessageBubble({ message, nextMessageSender }) {
  const { auth } = useContext(AuthContext);

  return (
    <div
      className={`w-full flex pt-1 px-3 max-md:px-0 ${
        message?.sender === auth.user._id ? 'justify-end' : ''
      } ${nextMessageSender === message?.sender ? '!pt-[2px]' : ''}`}
    >
      <div
        className={`py-2 flex flex-wrap items-center gap-x-2 text-wrap w-max max-w-[600px] rounded-md min-w-[72px] ${
          message?.sender === auth.user._id
            ? 'pl-2 pr-2 bg-dark-blue text-white rounded-tr-none'
            : 'pr-2 pl-2 bg-blue-100 text-black rounded-tl-none'
        } ${nextMessageSender === message?.sender ? '!rounded-md' : ''}`}
      >
        <p className="text-sm max-sm:text-xs hyphens-auto text-wrap h-max max-w-full break-words">
          {message?.content}
        </p>
        <span className="text-xs max-sm:text-[0.7rem] text-gray-600 ml-auto">
          {moment(message?.createdAt).calendar().replace('Today at', '').replace('', '')}
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
