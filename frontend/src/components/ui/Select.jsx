import PropTypes from 'prop-types';
import { v4 as uuidV4 } from 'uuid';

function Select({
  className,
  name,
  placeholder,
  label,
  options,
  onChange,
  selected,
}) {
  const defaultClassName = 'flex flex-col';

  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;
  return (
    <div className={combinedClassName}>
      <label htmlFor={name} className={`mb-1 relative `}>
        <h6>{label}</h6>
      </label>
      <select
        className="select select-bordered text-base"
        id={name}
        onChange={onChange}
        value={selected || placeholder}
      >
        {placeholder && (
          <option disabled value={placeholder} className="hidden">
            {placeholder}
          </option>
        )}
        {options &&
          options.map((option) => (
            <option key={uuidV4()} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  );
}

Select.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  selected: PropTypes.any,
};

export default Select;
