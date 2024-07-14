import { AuthContext } from '@/context/AuthProvider';
import { ConversationContext } from '@/context/ConversationProvider';
import axiosInstance from '@/utils/axiosInstance';
import { Button, Chip } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { MessageUser02Icon } from 'hugeicons-react';
import moment from 'moment/moment';
import propTypes from 'prop-types';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RequestCard({ request, refetch, withPadding }) {
  const { auth } = useContext(AuthContext);
  const { chatState } = useContext(ConversationContext);
  const navigate = useNavigate();

  const removeMutation = useMutation({
    mutationKey: ['removeRequest'],
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(
        `/client/requests/${request._id}`
      );
      return data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const onCancel = () => {
    removeMutation.mutate();
  };

  const onContact = () => {
    const conversationId = Array.from(chatState.conversations.values()).find(
      (conversation) => conversation.participants.includes(request.userId._id)
    )?._id;

    if (conversationId) {
      navigate(`/tenant/messages/${conversationId}`);
    } else {
      navigate(`/tenant/messages/new/${request.userId._id}`);
    }
  };

  return (
    <div
      className={`w-full py-2 border-b-2 border-gray-500 ${
        withPadding ? 'px-2' : ''
      }`}
    >
      <div className="flex items-start">
        <span className="text-sm text-gray-600">
          Posted {moment(request.createdAt).fromNow()} by
          <br />
          <p className="text-base text-black leading-3">
            {request.userId._id === auth.user._id
              ? 'You'
              : request.userId.firstName + ' ' + request.userId.lastName}
          </p>
        </span>
        {request.status ? (
          <p
            className={`ml-auto w-fit ${
              request.status === 'accepted'
                ? 'text-green-500'
                : request.status === 'pending'
                ? 'text-blue-500'
                : 'text-red-500'
            }`}
          >
            Status: {request.status}
          </p>
        ) : (
          ''
        )}
      </div>
      <span className="text-xs text-gray-600">
        Roommates: {request.details.numberOfRoommatesApplied}/
        {request.details.numberOfRoommatesTotal} - Budget: {request.budget}DH
      </span>
      <p className="text-base mt-1">{request.details.message}</p>
      <div className="w-full flex max-sm:flex-col max-md:items-start items-center gap-2 mt-3">
        <div className="flex items-center gap-1">
          {request.details.preferences.length > 0 &&
            request.details.preferences.map((preference) => (
              <Chip
                key={preference}
                value={preference}
                size="sm"
                className="text-sm font-normal bg-gray-500 text-gray-700"
              />
            ))}
        </div>
        {request.userId._id === auth.user._id ? (
          <Button
            size="sm"
            className="ml-auto bg-gray-500 text-gray-700"
            onClick={onCancel}
            loading={removeMutation.isPending}
          >
            Cancel
          </Button>
        ) : (
          <div className="flex items-center gap-1 ml-auto">
            {request.listingId ? (
              <Link
                to={`/tenant/rent/${request.listingId}`}
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                View attached listing
              </Link>
            ) : (
              ''
            )}
            <Button
              size="sm"
              className="bg-dark-blue flex items-center gap-1"
              onClick={onContact}
            >
              <MessageUser02Icon size={18} />
              Contact
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

RequestCard.propTypes = {
  request: propTypes.object,
  listing: propTypes.object,
  refetch: propTypes.func,
  withPadding: propTypes.bool,
};

export default RequestCard;
