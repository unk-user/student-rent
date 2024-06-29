import { Button, Carousel } from '@material-tailwind/react';
import {
  Bathtub01Icon,
  BedSingle01Icon,
  FavouriteIcon,
  SquareIcon,
} from 'hugeicons-react';
import propTypes from 'prop-types';

function ListingCard({ listing }) {
  return (
    <div key={listing._id} className=" bg-white">
      <div>
        <Carousel
          className="bg-gray-300 !max-w-full aspect-[4/3]"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
              {new Array(length).fill('').map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                    activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        >
          {listing?.details?.images &&
            listing.details.images.map((image) => (
              <img
                key={image.public_id}
                src={image.url}
                alt="listing image"
                className="w-full h-full object-cover"
              />
            ))}
        </Carousel>
      </div>
      <div className="px-3 pt-4 pb-5 h-[140px]">
        <div className="flex items-center justify-between text-blue-300">
          <p className="text-sm">
            <span className="text-base font-medium">
              {listing.details.price}DH/
            </span>
            month
          </p>
          <Button
            variant="outlined"
            className="rounded-full p-1 text-blue-300 border-gray-600"
          >
            <FavouriteIcon size={18} />
          </Button>
        </div>
        <div className="py-2 mb-2 border-b-2 border-gray-400">
          <p className="font-medium leading-tight">{listing.details.title}</p>
          <p className="text-sm text-gray-600">{listing.details.location}</p>
        </div>
        <div className="flex items-center gap-3">
          {listing.details.rooms && (
            <div className="flex items-center gap-[2px]">
              <BedSingle01Icon size={20} className="text-blue-300" />
              <p className="text-xs">{listing.details.rooms} rooms</p>
            </div>
          )}
          {listing.details.bathrooms && (
            <div className="flex items-center gap-[2px]">
              <Bathtub01Icon size={20} className="text-blue-300" />
              <p className="text-xs">{listing.details.bathrooms} bathrooms</p>
            </div>
          )}
          {listing.details.area && (
            <div className="flex items-center gap-[2px]">
              <SquareIcon size={20} className="text-blue-300" />
              <p className="text-xs">{listing.details.area} m&sup2;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ListingCard.propTypes = {
  listing: propTypes.object,
};

export default ListingCard;
