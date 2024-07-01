import { Carousel } from '@material-tailwind/react';
import { Bathtub01Icon, BedSingle01Icon, SquareIcon } from 'hugeicons-react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
  return (
    <div className=" bg-white hover:scale-[1.02] transition-transform duration-300">
      <div>
        <Carousel
          className="bg-gray-300 !max-w-full aspect-[5/4]"
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
              <Link key={image.public_id} to={`/tenant/rent/${listing._id}`}>
                <img
                  src={`${image.url.replace('/upload/', '/upload/q_auto/')}`}
                  loading="lazy"
                  alt="listing image"
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
        </Carousel>
      </div>
      <Link to={`/tenant/rent/${listing._id}`}>
        <div className="px-3 pt-4 pb-5 h-[140px]">
          <div className="text-blue-300">
            <p className="text-sm">
              <span className="text-base font-medium">
                {listing.details.price}DH/
              </span>
              month
            </p>
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
      </Link>
    </div>
  );
}

ListingCard.propTypes = {
  listing: propTypes.object,
};

export default ListingCard;
