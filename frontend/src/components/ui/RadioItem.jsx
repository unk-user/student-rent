import PropTypes from 'prop-types';

function RadioItem({ className, name, label, value, onChange, checked }) {
  const defaultClassName = 'flex items-center relative';
  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <div className={combinedClassName}>
    <label htmlFor={`${value}-${name}`} className="text-sm cursor-pointer">
      <input
        type="radio"
        className="relative top-[1px] mr-1 radio-input"
        name={name}
        id={`${value}-${name}`}
        value={value}
        onChange={onChange}
        checked={checked}
      />
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
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};
