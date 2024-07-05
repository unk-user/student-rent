import { Button, Rating } from '@material-tailwind/react';
import ReviewDialog from './ReviewDialog';
import Review from './Review';
import { useState } from 'react';
import propTypes from 'prop-types';

function ReviewSection({ listing, refetch, listingId }) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleReviewDialog = () => {
    if (listing.reviewed) return setReviewDialogOpen(false);
    setReviewDialogOpen(!reviewDialogOpen);
  };

  return (
    <div className="w-full mt-12">
      <h4 className="text-lg font-medium">Reviews and ratings</h4>
      <div className="flex items-center pb-2 border-b-2 border-gray-500">
        <div className="text-lg mr-1 text-white bg-blue-500 p-[1px]">
          {parseFloat(listing.interactionSummary.reviewAvg).toFixed(1)}
        </div>
        <Rating
          value={Math.round(listing.interactionSummary.reviewAvg)}
          ratedColor="blue"
          readonly
        />
        <p className="ml-2 text-gray-600 max-sm:hidden">
          Based on {listing.interactionSummary.reviewCount} review
          {listing.interactionSummary.reviewCount > 1 ? 's' : ''}
        </p>
        <Button
          size="sm"
          className="ml-auto text-sm rounded-[6px] bg-blue-300"
          onClick={handleReviewDialog}
        >
          {!listing.reviewed ? 'Leave a review' : 'Reviewed'}
        </Button>
        <ReviewDialog
          disabled={!!listing.reviewed}
          open={reviewDialogOpen}
          handler={handleReviewDialog}
          listingId={listingId}
          refetchListing={refetch}
        />
      </div>
      <div className="grid grid-cols-4 max-xl:gap-1 max-md:grid-cols-2 max-sm:grid-cols-1 gap-3 py-3">
        {listing.reviews?.map((review) => (
          <Review key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
}

ReviewSection.propTypes = {
  listing: propTypes.object,
  refetch: propTypes.func,
  listingId: propTypes.string,
};

export default ReviewSection;
