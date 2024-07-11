import propTypes from 'prop-types';
import defaultProfile from '@/assets/blank-profile-picture-973460.svg';
import { Chip } from '@material-tailwind/react';
import { ConversationContext } from '@/context/ConversationProvider';
import { useContext } from 'react';

function ChatHeader({ userData }) {
  const { participantsStatus } = useContext(ConversationContext);

  return (
    <div className="w-full absolute top-0 left-0 right-0 px-2 py-2 h-14 border-b-2 border-gray-300 z-20 bg-white">
      <div className="h-full flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden">
          <img
            src={userData?.profilePicture?.url || defaultProfile}
            alt="profile"
          />
        </div>
        <div className="ml-2 h-full">
          <span className="flex items-center gap-1">
            <p className="text-base leading-3">
              {userData?.firstName + ' ' + userData?.lastName}
            </p>
            <Chip
              size="sm"
              value={userData?.role}
              className={`!font-normal rounded-[10px] !py-0 !px-1 text-[12px] normal-case ${
                userData?.role === 'landlord'
                  ? 'bg-blue-200 text-blue-300'
                  : 'bg-gray-500 text-gray-700'
              }`}
            />
          </span>
          {participantsStatus && participantsStatus[userData?._id] && participantsStatus[userData?._id] !== 'offline' ? (
            <span className="text-sm text-blue-300">
              {participantsStatus[userData?._id]}
            </span>
          ) : (
            <span className="text-sm text-gray-600">Offline</span>
          )}
        </div>
      </div>
    </div>
  );
}

ChatHeader.propTypes = {
  userData: propTypes.object,
};

export default ChatHeader;
