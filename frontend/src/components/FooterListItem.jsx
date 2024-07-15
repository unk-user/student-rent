import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

function FooterListItem({ to, label }) {
  return (
    <li>
      <Link className='text-sm hover:underline' to={to}>{label}</Link>
    </li>
  );
}

FooterListItem.propTypes = {
  to: propTypes.string,
  label: propTypes.string,
};

export default FooterListItem;
