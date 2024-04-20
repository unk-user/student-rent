import PropTypes from 'prop-types';
import { LiaBathSolid, LiaBedSolid } from 'react-icons/lia';

function ListingCard({ listing }) {
  return (
    <>
      <div className="w-full aspect-square bg-slate-500 rounded-2xl">
        image container
      </div>
      <ul className="px-2 py-1">
        <li className="flex items-center justify-between">
          {listing.price ? (
            <p className="text-[#354FB8] font-semibold">{`${listing.price}DH`}</p>
          ) : (
            <span className="flex w-72 h-6 rounded-sm mt-1 bg-gray-400"></span>
          )}
          {listing.category && (
            <div className="px-2 py-1 rounded-md bg-[#F6CA45]">
              {listing.category}
            </div>
          )}
        </li>
        <li className="flex justify-between mt-1">
          <div className="flex flex-col">
            {listing.address ? (
              <p>{listing.address}</p>
            ) : (
              <span className="flex w-32 h-6 mt-1 rounded-sm bg-gray-400"></span>
            )}
            {listing.city ? (
              <p>{listing.city}</p>
            ) : (
              <span className="flex w-24 my-1 h-6 rounded-sm bg-gray-400"></span>
            )}
          </div>
          <div className="flex flex-col">
            {listing.bathrooms && (
              <span className="flex  gap-1 items-center">
                <LiaBathSolid className="text-2xl" />
                {listing.bathrooms}
              </span>
            )}
            {listing.rooms && (
              <span className="flex gap-1 items-center">
                <LiaBedSolid className="text-2xl" />
                {listing.rooms}
              </span>
            )}
          </div>
        </li>
      </ul>
    </>
  );
}

ListingCard.propTypes = {
  listing: PropTypes.object,
};

export default ListingCard;
