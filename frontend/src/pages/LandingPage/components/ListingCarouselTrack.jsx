import ListingCard from '@/components/ListingCard';
import propTypes from 'prop-types';

function ListingCarouselTrack({ listings }) {
  return (
    <ul className="grid grid-cols-5 items-center justify-center pl-3 gap-3 animate-infinite-scroll">
      {listings?.map((listing,) => (
        <li key={listing._id} className='w-[320px] max-md:w-[300px] max-sm:w-[280px]'>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}

ListingCarouselTrack.propTypes = {
  listings: propTypes.array,
};

export default ListingCarouselTrack;
