import axiosInstance from '@/utils/axiosInstance';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Rating,
  Textarea,
} from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import propTypes from 'prop-types';
import { useState } from 'react';

function ReviewDialog({ open, handler, listingId, refetchListing, disabled }) {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const mutation = useMutation({
    mutationKey: ['submitReview'],
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        `/client/listings/${listingId}/review`,
        {
          comment: reviewComment,
          rating: reviewRating,
        }
      );
      return data;
    },
    onSuccess: () => {
      handler();
      setReviewRating(5);
      setReviewComment('');
      refetchListing();
    },
  });
  const handleSubmit = (e) => {
    if (disabled || mutation.isPending) return;
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog open={open} handler={handler}>
      <form onSubmit={handleSubmit}>
        <DialogHeader className="text-xl font-medium pb-0">
          Leave a review!
        </DialogHeader>
        <DialogBody className="pt-0 pb-0">
          <p className="text-base text-gray-600 font-normal mb-3">
            Your input is important in order to improve our service to suit you
            perfectly.
          </p>
          <p className="text-base font-medium text-black mb-1">
            How would you rate this property?
          </p>
          <Rating
            value={reviewRating}
            onChange={setReviewRating}
            ratedColor="blue"
            className="large-rating mb-8"
          />
          <Textarea
            required={true}
            label="Add a comment..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            maxLength={500}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full text-base bg-blue-300"
            loading={mutation.isPending}
          >
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

ReviewDialog.propTypes = {
  open: propTypes.bool,
  handler: propTypes.func,
  listingId: propTypes.string,
  refetchListing: propTypes.func,
  disabled: propTypes.bool,
};

export default ReviewDialog;
