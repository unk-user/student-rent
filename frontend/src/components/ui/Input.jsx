import PropTypes from 'prop-types';

export default function Input({
  className,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  minLength = 'none',
  maxLength = 'none',
  required = false,
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
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        id={name}
        className={`input input-bordered rounded-md py-2 pl-4 px-2 h-11`}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  minLength: PropTypes.any,
  maxLength: PropTypes.any,
  required: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
