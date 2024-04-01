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
  validationMessage,
  invalidFields,
}) {
  const defaultClassName = 'flex flex-col';

  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  const invalid = invalidFields
    ? invalidFields.find((item) => {
        return item.field === name;
      })
    : false;

  return (
    <div className={combinedClassName}>
      <label
        htmlFor={name}
        className={`text-sm font-medium mb-1 relative ${
          invalid && 'text-red-400'
        }`}
      >
        {label}
        {invalid && (
          <p className="text-xs absolute left-28 bottom-0">
            {validationMessage}
          </p>
        )}
      </label>
      <input
        onChange={handleChange}
        type={type}
        name={name}
        id={name}
        className={`rounded-md py-2 px-2 h-9 text-sm ${
          invalid && ' outline-red-500 outline outline-1 outline-offset-1'
        }`}
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
  minLength: PropTypes.any,
  maxLength: PropTypes.any,
  required: PropTypes.bool,
  invalidFields: PropTypes.array,
  validationMessage: PropTypes.string,
};
