import { Rating } from '@material-tailwind/react';
import propTypes from 'prop-types';

function FakeReview({ user, children, rating, role, profileSrc }) {
  return (
    <div className="bg-white h-[280px] max-sm:h-[240px] p-4 flex flex-col">
      <Rating value={rating} ratedColor="blue" readonly />
      <p className="mt-2">{children}</p>
      <div className="flex items-center mt-auto">
        <div className="w-10 h-10 overflow-hidden bg-gray-600 rounded-full">
          <img src={profileSrc} alt="user-profile" />
        </div>
        <div className="flex flex-col ml-2">
          <p className="text-sm">{user}</p>
          <span className="text-xs text-gray-600">{role}</span>
        </div>
      </div>
    </div>
  );
}

FakeReview.propTypes = {
  user: propTypes.string,
  children: propTypes.string,
  rating: propTypes.number,
  role: propTypes.string,
  profileSrc: propTypes.string,
};

export default FakeReview;
