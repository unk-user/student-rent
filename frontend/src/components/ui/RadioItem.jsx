import PropTypes from 'prop-types';
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from 'react-icons/io';

function RadioItem({ className, name, label, value, onChange, checked }) {
  const defaultClassName = 'flex items-center relative';
  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <div className={combinedClassName}>
      <IoIosRadioButtonOff/>
      <IoIosRadioButtonOn/>
      <input
        type="radio"
        className="relative top-[1px] mr-1 "
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={name} className="text-sm">
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
