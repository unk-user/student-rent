import PropTypes from 'prop-types';
import Button from './Button';

function LandlordCard({ name, properties }) {
  return (
    <div>
      <h5>Landlord</h5>
      <div className="flex items-center gap-2 max-w-[560px]">
        <div className="w-14 h-14 rounded-full bg-gray-500"></div>
        <div>
          <p>{name}</p>
          <p>Properties: {properties}</p>
        </div>
        <Button className='ml-auto'>Message</Button>
      </div>
    </div>
  );
}

LandlordCard.propTypes = {
  name: PropTypes.string,
  properties: PropTypes.number,
};

export default LandlordCard;
