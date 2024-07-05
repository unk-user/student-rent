import { Button } from '@material-tailwind/react';
import { ArrowLeft01Icon, FavouriteIcon, Share08Icon } from 'hugeicons-react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

function ListingHeader({ liked, handleLike, details }) {
  return (
    <div>
      <Link
        to={-1}
        className="flex items-center w-max gap-[1px] text-sm font-medium text-blue-300 opacity-80 hover:opacity-100"
      >
        <ArrowLeft01Icon size={20} />
        Back
      </Link>
      <h2 className="text-2xl">{details?.title}</h2>
      <div className="flex items-center w-full">
        <p className="text-base text-gray-600">{details?.location}</p>
        <Button
          variant="outlined"
          size="sm"
          className="rounded-[6px] ml-auto flex items-center gap-1 text-blue-300 border-gray-500 font-medium"
        >
          <Share08Icon size={20} />
          Share
        </Button>
        <Button
          onClick={handleLike}
          variant="outlined"
          size="sm"
          className={
            'rounded-[6px] flex ml-2 items-center gap-1 text-blue-300 border-gray-500 font-medium' +
            (liked ? ' bg-blue-200' : '')
          }
        >
          <FavouriteIcon className={liked ? 'fill-blue-300' : ''} size={20} />
          Favourite
        </Button>
      </div>
    </div>
  );
}

ListingHeader.propTypes = {
  liked: propTypes.bool,
  handleLike: propTypes.func,
  details: propTypes.object,
};

export default ListingHeader;
