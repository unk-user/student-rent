import PropTypes from 'prop-types';

function RadioItem({ className, label, value, name , selectedRole, handleRoleSelection }) {
  const defaultClassName = 'flex items-center relative cursor-pointer';
  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <label htmlFor={value} className={combinedClassName}>
      <input
        type="radio"
        className="relative top-[1px] mr-1"
        name={name}
        id={value}
        value={value}
        checked={selectedRole === value}
        onChange={handleRoleSelection}
      />
      {label}
    </label>
  );
}

export default RadioItem;

RadioItem.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  selectedRole: PropTypes.string,
  handleRoleSelection: PropTypes.func
};
