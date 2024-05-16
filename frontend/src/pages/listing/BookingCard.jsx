import PropTypes from 'prop-types';
import Button from '@src/components/Button';

function BookingCard({ listing }) {
  

  return (
    <div className="p-2 border-4 rounded-lg max-w-[460px] bg-gray-200 h-max sticky top-4">
      <ul>
        <li>
          <h6>Address</h6>
          <p>{listing.address}</p>
        </li>
        <li>
          <h6>Residents: {listing.students.length} / total</h6>
          <div>
            {listing.students.length > 0 ? (
              //TODO: make component for displaying tenant basic data
              listing.students.map((student, index) => <div key={index}>none</div>) 
            ) : (
              <p>Empty</p>
            )}
          </div>
        </li>
        <li>
          <h6>Renting period</h6>
          <div>{listing.period}</div>
        </li>
        <li>
          <h6>Total price</h6>
          <p>{listing.price}DH</p>
        </li>
      </ul>
      <div className="grid">
        <div className="flex items-center justify-between">
          <h6>Pricing per resident</h6>
          <p>(total price / residents)</p>
        </div>
        <Button name="book-btn" className="text-xl text-white bg-black">
          Book
        </Button>
      </div>
    </div>
  );
}

BookingCard.propTypes = {
  listing: PropTypes.object,
};

export default BookingCard;
