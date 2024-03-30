import PropTypes from 'prop-types';

export default function Button({
  className,
  type = 'button',
  handleClick,
  children,
  name,
}) {
  const defaultClassName = 'border rounded-md px-6 p-2';

  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <button
      className={combinedClassName}
      name={name}
      type={type}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  handleClick: PropTypes.func,
  children: PropTypes.string,
  name: PropTypes.string,
};
