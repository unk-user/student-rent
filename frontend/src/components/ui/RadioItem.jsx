import PropTypes from 'prop-types';

function RadioItem({
  className,
  label,
  value,
  name,
  selectedRole,
  handleRoleSelection,
  index
}) {
  const defaultClassName = 'flex items-center relative radio-container';
  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <div className={combinedClassName}>
      <input
        type="radio"
        className="relative top-[1px] mr-1 radio-input cursor-pointer"
        name={name}
        id={value}
        value={value}
        checked={selectedRole === value}
        onChange={handleRoleSelection}
        tabIndex={index}
      />
      <label htmlFor={value} className="radio-label cursor-pointer">
        {label}
      </label>
    </div>
  );
}

export default RadioItem;

RadioItem.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  selectedRole: PropTypes.string,
  handleRoleSelection: PropTypes.func,
  index: PropTypes.number
};
