import propTypes from 'prop-types';
import { Input } from '@material-tailwind/react';

function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  children,
  required,
  withButton,
  containerClassName,
  ...props
}) {
  return (
    <div className={containerClassName}>
      <p>{label}</p>
      <div className="relative flex w-full mt-1">
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`!border-2 !border-t-blue-gray-200 focus:!border-t-gray-900 placeholder:text-gray-500 ${
            withButton && 'pr-20'
          }`}
          labelProps={{
            className: 'hidden',
          }}
          containerProps={{
            className: 'min-w-0',
          }}
          required={required}
          {...props}
        />
        {withButton ? (
          <div className="!absolute right-1 top-0 h-full flex items-center ">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

FormInput.propTypes = {
  label: propTypes.string,
  value: propTypes.any,
  onChange: propTypes.func,
  type: propTypes.string,
  placeholder: propTypes.string,
  children: propTypes.node,
  required: propTypes.bool,
  withButton: propTypes.bool,
  containerClassName: propTypes.string,
};

export default FormInput;
