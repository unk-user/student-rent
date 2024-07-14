import { Select } from '@material-tailwind/react';
import { ArrowDown01Icon } from 'hugeicons-react';
import propTypes from 'prop-types';

function FilterSelect({ children, label, value, onChange, required }) {
  return (
    <Select
      variant="static"
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      arrow={<ArrowDown01Icon size={20} />}
      color="blue"
      className="!text-sm !font-medium !text-black rounded-none"
      containerProps={{ className: `!h-8 mt-2 !min-w-[120px]` }}
      labelProps={{
        className: '!text-xs !text-gray-500 peer-aria-expanded:!text-black',
      }}
      menuProps={{
        className:
          'rounded-none mt-[14px] !w-[calc(100%+2rem)] max-sm:!w-full !-translate-x-[1rem] max-sm:!-translate-x-0 !text-xs max-md:!-mt-4 pt-2',
      }}
    >
      {children}
    </Select>
  );
}

FilterSelect.propTypes = {
  label: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
  required: propTypes.bool,
  children: propTypes.any,
};

export default FilterSelect;
