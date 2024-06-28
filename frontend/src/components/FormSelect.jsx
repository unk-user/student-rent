import propTypes from 'prop-types';
import { Select, Option } from '@material-tailwind/react';
import { v4 as uuid } from 'uuid';
import { ArrowDown01Icon } from 'hugeicons-react';

function FormSelect({
  label,
  value,
  onChange,
  placeholder,
  required,
  options,
  containerClassName,
  ...props
}) {
  return (
    <div className={containerClassName}>
      <p>{label}</p>
      <div className="mt-1">
        <Select
          className="!border-2 !border-t-blue-gray-200 focus:!border-gray-900 aria-expanded:!border-gray-900 placeholder:text-gray-500"
          labelProps={{
            className: 'hidden',
          }}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          arrow={<ArrowDown01Icon size={20} />}
          {...props}
        >
          {options.map((option) => (
            <Option key={uuid()} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}

FormSelect.propTypes = {
  label: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
  placeholder: propTypes.string,
  required: propTypes.bool,
  options: propTypes.arrayOf(propTypes.string),
  containerClassName: propTypes.string,
};

export default FormSelect;
