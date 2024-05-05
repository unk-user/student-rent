import PropTypes from 'prop-types';

export default function Textarea({
  className,
  name,
  value,
  placeholder = '',
  onChange,
  label,
  minLength = 'none',
  maxLength = 'none',
}) {
  const length = value?.length || 0;

  const defaultClassName = 'flex flex-col relative';

  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <div className={combinedClassName}>
      <label htmlFor={name} className={`mb-1 relative `}>
        <h6>{label}</h6>
      </label>
      <textarea
        placeholder={placeholder}
        name={name}
        id={name}
        minLength={minLength}
        maxLength={maxLength}
        cols="30"
        value={value}
        onChange={onChange}
        rows="10"
        className="textarea textarea-bordered text-base resize-none p-2 textarea-lg w-full h-24"
      ></textarea>
      {maxLength && (
        <div className="absolute -bottom-5 right-0 text-sm">
          {length} / {maxLength}
        </div>
      )}
    </div>
  );
}

Textarea.propTypes = {
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
