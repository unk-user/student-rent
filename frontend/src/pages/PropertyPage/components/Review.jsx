import { Rating } from '@material-tailwind/react';
import moment from 'moment/moment';
import propTypes from 'prop-types';

function Review({ review }) {
  return (
    <div className="py-3 px-2 bg-blue-100 flex flex-col h-[280px]">
      <div className="flex items-center justify-between">
        <Rating
          readonly
          value={review.rating}
          ratedColor="blue"
          className="small-rating"
        />
        <p className="text-gray-600 text-sm">
          {moment(review.createdAt).fromNow()}
        </p>
      </div>
      <div className="w-full my-2 flex-1 overflow-hidden">
        <p className="text-base hyphens-auto max-w-full">{review.comment}</p>
      </div>
      <div className="w-full flex items-center">
        <div className="w-8 h-8 overflow-hidden bg-gray-600 rounded-full">
          {review.userId.profilePicture && (
            <img
              src={review.userId.profilePicture.url}
              alt="profile picture"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <p className="ml-2 text-sm">
          {review.userId.firstName + ' ' + review.userId.lastName}
        </p>
      </div>
    </div>
  );
}

Review.propTypes = {
  review: propTypes.object,
};

export default Review;
