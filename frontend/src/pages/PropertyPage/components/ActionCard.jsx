import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { Button } from '@material-tailwind/react';

function ActionCard({ listing, handleRequestDialog }) {
  return (
    <div className="col-span-2 h-full border-2 py-2 px-3 border-gray-400">
      <div className="flex items-center">
        <p>Rent Price</p>
        <p className="ml-auto text-lg max-md:text-base font-medium text-blue-300">
          {listing.details.price}DH/month
        </p>
      </div>
      <Link className="w-max text-gray-600 hover:text-black transition-colors duration-200 flex items-center mt-2">
        <div className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden">
          {listing.landlord.profilePicture && (
            <img
              src={listing.landlord.profilePicture.url}
              className="w-full h-full object-cover"
              alt="profile"
            />
          )}
        </div>
        <p className="ml-2">
          {listing.landlord.firstName} {listing.landlord.lastName}
        </p>
      </Link>
      <Button
        className="w-full text-base rounded-[6px] mt-2 bg-dark-blue"
        onClick={handleRequestDialog}
      >
        Request
      </Button>
    </div>
  );
}

ActionCard.propTypes = {
  listing: propTypes.object,
  handleRequestDialog: propTypes.func,
};

export default ActionCard;
