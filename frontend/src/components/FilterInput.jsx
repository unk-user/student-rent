import { Input } from '@material-tailwind/react';
import propTypes from 'prop-types';

function FilterInput({ label, value, onChange, placeholder, required }) {
  return (
    <Input
      variant="static"
      type="text"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="!text-sm !text-black !font-medium"
      containerProps={{ className: '!min-w-[120px] !h-8 mt-2' }}
      labelProps={{
        className: '!text-xs !text-gray-500 peer-focus:!text-black',
      }}
    />
  );
}

FilterInput.propTypes = {
  label: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
  placeholder: propTypes.string,
  required: propTypes.bool,
};

export default FilterInput;
