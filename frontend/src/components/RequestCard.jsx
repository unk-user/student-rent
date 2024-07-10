import { AuthContext } from '@/context/AuthProvider';
import { ConversationContext } from '@/context/ConversationProvider';
import axiosInstance from '@/utils/axiosInstance';
import { Button, Chip, IconButton } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { ThumbsUpIcon } from 'hugeicons-react';
import moment from 'moment/moment';
import propTypes from 'prop-types';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RequestCard({ request, refetch, withPadding }) {
  const { auth } = useContext(AuthContext);
  const { chatState } = useContext(ConversationContext);
  const [likeDisable, setLikeDisable] = useState(false);
  const navigate = useNavigate();

  const removeMutation = useMutation({
    mutationKey: ['removeRequest'],
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(
        `/client/listings/${request.listingId}/request`
      );
      return data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const likeMutation = useMutation({
    mutationKey: ['likeRequest'],
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        `/client/listings/${request.listingId}/request/like`
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

  const onLike = () => {
    if (likeDisable) return;
    setLikeDisable(true);
    likeMutation.mutate();
    setInterval(() => {
      setLikeDisable(false);
    }, 1000);
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
        <div>
          <span className="text-sm text-gray-600">
            Posted {moment(request.createdAt).fromNow()} by
          </span>
          <p className="text-sm leading-4">
            {request.userId._id === auth.user._id
              ? 'You'
              : request.userId.firstName + ' ' + request.userId.lastName}
            <br />
            <span className="text-xs text-gray-600">
              Roommates: {request.details.numberOfRoommatesApplied}/
              {request.details.numberOfRoommatesNeeded} - Est.split:{' '}
              {request.price / request.details.numberOfRoommatesNeeded}
              DH/rm
            </span>
          </p>
        </div>
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
      </div>
      <p className="text-base mt-1">{request.details.message}</p>
      <div className="w-full flex items-center gap-1 mt-3">
        {request.details.preferences.length > 0 &&
          request.details.preferences.map((preference) => (
            <Chip
              key={preference}
              value={preference}
              size="sm"
              className="text-sm font-normal bg-gray-500 text-gray-700"
            />
          ))}
        {request.userId._id === auth.user._id ? (
          <Button
            size="sm"
            className="ml-auto rounded-[6px] bg-gray-500 text-gray-700"
            onClick={onCancel}
            loading={removeMutation.isPending}
            variant="outlined"
          >
            Cancel
          </Button>
        ) : (
          <div className="flex -items-center ml-auto">
            <Button
              size="sm"
              className="rounded-[6px] bg-blue-300"
              onClick={onContact}
            >
              Contact
            </Button>
            <IconButton
              className="aspect-square ml-2 text-blue-300 relative"
              variant="text"
              onClick={onLike}
              disabled={likeDisable}
            >
              <div className="flex flex-col items-center">
                <ThumbsUpIcon
                  size={28}
                  className={
                    request.likes.includes(auth.user._id) ? 'fill-blue-500' : ''
                  }
                />
                <span className="text-[12px] leading-3">
                  {request.likesCount || 0}
                </span>
              </div>
            </IconButton>
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
