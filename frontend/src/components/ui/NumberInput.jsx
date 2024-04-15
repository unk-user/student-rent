import { useState } from 'react';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import PropTypes from 'prop-types';

function NumberInput({ value, setValue, min = 0, max = 20, id, step = 1 }) {
  
  return (
    <div className="flex items-center gap-[1px]">
      <button
        type="button"
        onClick={() => {
          const newValue = Math.max(min, parseFloat(value) - step);
          setValue(newValue);
        }}
        className="w-6 h-10 bg-[#354fb6] border rounded-lg active:bg-[hsl(228,55%,55%)]"
      >
        <IoMdArrowDropleft className="text-[hsl(228,55%,32%)] text-2xl" />
      </button>
      <input
        type="text"
        id={id}
        className="h-10 rounded-md text-center bg-gray-300 w-12 border outline-none"
        value={value || 'Any'}
        readOnly
      />

      <button
        type="button"
        onClick={() => {
          const newValue = Math.min(max, parseFloat(value) + step);
          setValue(newValue);
        }}
        className="w-6 h-10 bg-[#354FB8] border rounded-lg active:bg-[hsl(228,55%,55%)]"
      >
        <IoMdArrowDropright className="text-[hsl(228,55%,32%)] text-2xl" />
      </button>
    </div>
  );
}

NumberInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  id: PropTypes.string,
  step: PropTypes.number,
};

export default NumberInput;
