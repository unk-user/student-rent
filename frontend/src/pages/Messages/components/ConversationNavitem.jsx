import { AuthContext } from '@/context/AuthProvider';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import defaultAvatar from '@/assets/blank-profile-picture-973460.svg';
import moment from 'moment/moment';
import { ConversationContext } from '@/context/ConversationProvider';

function ConversationNavitem({ conversation }) {
  const { auth } = useContext(AuthContext);
  const { participantsStatus } = useContext(ConversationContext);

  const userData = conversation?.participants.filter(
    (participant) => participant._id !== auth.user._id
  )[0];

  return (
    <NavLink
      to={'/tenant/messages/' + conversation._id}
      className={({ isActive }) =>
        [
          isActive ? 'border-l-2 border-blue-300' : '',
          'flex item-center p-1 transition duration-500',
        ].join(' ')
      }
    >
      <div className="h-11 w-11 rounded-full relative">
        <div
          className={`w-2 h-2 rounded-full absolute bottom-[1px] outline outline-1 outline-white right-[1px] ${
            participantsStatus && participantsStatus[userData._id] === 'online'
              ? 'bg-blue-300'
              : 'bg-gray-500'
          }`}
        ></div>
        <img
          src={userData?.profilePicture?.url || defaultAvatar}
          alt="profile"
          className="object-cover w-full h-full rounded-full"
        />
      </div>
      <div className="flex flex-col ml-2 flex-1">
        <div className="flex items-center">
          <p className="text-base">
            {userData.firstName + ' ' + userData.lastName}
          </p>
          <span
            className={`ml-auto text-sm ${
              conversation.newMessagesCount[0]?.count > 0
                ? 'text-black'
                : 'text-gray-600'
            }`}
          >
            {moment(conversation.updatedAt).format('LT').replace(' ', '')}
          </span>
        </div>
        <div className="flex items-center">
          <span
            className={`${
              conversation.newMessagesCount[0]?.count > 0
                ? 'text-black'
                : 'text-gray-600'
            } text-sm max-w-[200px] truncate`}
          >
            {conversation.lastMessage?.content}
          </span>
          {conversation.newMessagesCount[0]?.count > 0 && (
            <span className="ml-auto rounded-full text-sm bg-blue-300 text-white w-5 h-5 flex items-center justify-center">
              {conversation.newMessagesCount[0]?.count < 10
                ? conversation.newMessagesCount[0]?.count
                : '9+'}
            </span>
          )}
        </div>
      </div>
    </NavLink>
  );
}

ConversationNavitem.propTypes = {
  conversation: PropTypes.object,
};

export default ConversationNavitem;
