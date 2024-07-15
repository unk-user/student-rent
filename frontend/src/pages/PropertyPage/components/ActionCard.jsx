import { Link, useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import { Button } from '@material-tailwind/react';
import profileSvg from '@/assets/blank-profile-picture-973460.svg';
import { MessageUser02Icon } from 'hugeicons-react';
import { useContext } from 'react';
import { ConversationContext } from '@/context/ConversationProvider';

function ActionCard({ listing }) {
  const { chatState } = useContext(ConversationContext);
  const navigate = useNavigate();

  const onContact = () => {
    const conversationId = Array.from(chatState.conversations.values()).find(
      (conversation) => conversation.participants.includes(listing?.userId)
    )?._id;

    if (conversationId) {
      navigate(`/tenant/messages/${conversationId}`);
    } else {
      navigate(`/tenant/messages/new/${listing?.userId}`);
    }
  };

  return (
    <div className="col-span-2 max-sm:col-span-1 rounded-sm p-2">
      <div className="flex items-center">
        <p>Rent Price</p>
        <p className="ml-auto text-lg max-md:text-base font-medium text-blue-300">
          {listing.details.price}DH/month
        </p>
      </div>
      <Link className="text-gray-600 hover:text-black transition-colors duration-200 w-full flex items-center mt-4">
        <div className="w-12 h-12 bg-gray-500 rounded-full overflow-hidden">
          {listing.landlord.profilePicture ? (
            <img
              src={listing.landlord.profilePicture.url}
              className="w-full h-full object-cover"
              alt="profile"
            />
          ) : (
            <img src={profileSvg} alt="profile" />
          )}
        </div>
        <p className="ml-2 text-base">
          {listing.landlord.firstName} {listing.landlord.lastName}
        </p>
        <Button
          size="sm"
          className="bg-dark-blue flex items-center gap-1 ml-auto"
          onClick={onContact}
        >
          <MessageUser02Icon size={18} />
          Contact
        </Button>
      </Link>
    </div>
  );
}

ActionCard.propTypes = {
  listing: propTypes.object,
};

export default ActionCard;
