import propTypes from 'prop-types';

function ChatHeader({ userData }) {
  return (
    <div className="w-full absolute top-0 left-0 right-0 px-4 py-1 h-12 border-b-2 border-gray-300 z-20">
      {userData?.firstName + ' ' + userData?.lastName}
    </div>
  );
}

ChatHeader.propTypes = {
  userData: propTypes.object,
};

export default ChatHeader;
