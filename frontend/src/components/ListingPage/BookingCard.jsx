import PropTypes from 'prop-types';
import Button from '../ui/Button';
import AnonymousResidentCard from '../ui/AnonymousResidentCard';

function BookingCard({ listing }) {
  return (
    <div className="p-2 border-4 rounded-lg">
      <ul>
        <li>
          <h6>Address</h6>
          <p>{listing.address}</p>
        </li>
        <li>
          <h6>Residents: {listing.students.length} / total</h6>
          <div>
            {listing.students.length > 0 ? (
              listing.students.map((student) => (
                <AnonymousResidentCard key={student._id} student={student}/>
              ))
            ) : (
              <p>Empty</p>
            )}
          </div>
        </li>
        <li>
          <h6>Renting period</h6>
          <p>{listing.period}</p>
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
        <Button name='book-btn' className='text-xl'>Book</Button>
      </div>
    </div>
  );
}

BookingCard.propTypes = {
  listing: PropTypes.object,
};

export default BookingCard;
