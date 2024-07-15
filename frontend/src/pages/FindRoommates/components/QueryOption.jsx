import { NavLink } from 'react-router-dom';
import propTypes from 'prop-types';

function QueryOption({ label, to }) {
  return (
    <NavLink
      className={({ isActive }) =>
        [
          isActive ? 'border-blue-300 text-blue-300' : 'border-gray-300',
          'px-2 border-b-2 h-full flex items-center',
        ].join(' ')
      }
      to={to}
    >
      {label}
    </NavLink>
  );
}

QueryOption.propTypes = {
  label: propTypes.string,
  to: propTypes.string,
};

export default QueryOption;
