import PropTypes from 'prop-types';

export default function Input({
  className,
  type = 'text',
  name,
  placeholder,
  label,
  handleChange,
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
      <label htmlFor={name} className="text-sm font-medium mb-1">
        {label}
      </label>
      <input
        onChange={handleChange}
        type={type}
        name={name}
        id={name}
        className="rounded-md py-2 px-2 h-9 text-sm"
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
  handleChange: PropTypes.func,
  minLength: PropTypes.string,
  maxLength: PropTypes.string,
  required: PropTypes.bool,
};
