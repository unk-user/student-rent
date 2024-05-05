import Proptypes from 'prop-types';

function NavigationButton({ children, handleClick }) {
  return (
    <button
      onClick={handleClick}
      className="p-2 flex-grow flex gap-2 items-center"
    >
      {children}
    </button>
  );
}

NavigationButton.propTypes = {
  children: Proptypes.any,
  handleClick: Proptypes.func,
};

export default NavigationButton;
