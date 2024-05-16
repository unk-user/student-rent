import PropTypes from 'prop-types';
import { LiaBathSolid, LiaBedSolid } from 'react-icons/lia';

function Facilities({ listing }) {
  return (
    <div>
      <h5>Facilities</h5>
      <ul className="flex gap-4">
        <li className="flex items-center">
          <LiaBedSolid className='text-2xl mr-1 mb-[2px]'/>
          {listing.rooms} bedroom
        </li>
        <li className="flex items-center">
          <LiaBathSolid className='text-2xl mr-1 mb-[2px]'/>
          {listing.bathrooms} bathroom
        </li>
      </ul>
    </div>
  );
}

Facilities.propTypes = {
  listing: PropTypes.object,
};

export default Facilities;
