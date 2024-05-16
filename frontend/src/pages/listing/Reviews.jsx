import PropTypes from 'prop-types';

function Reviews({ reviews }) {
  return (
    <div>
      <h5>Reviews</h5>
    </div>
  );
}

Reviews.propTypes = {
  reviews: PropTypes.array,
};

export default Reviews;
