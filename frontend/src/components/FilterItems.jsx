import FilterInput from './FilterInput';
import FilterSelect from './FilterSelect';
import { Input, Option } from '@material-tailwind/react';
import { v4 as uuid } from 'uuid';
import propTypes from 'prop-types';

const categories = ['appartment', 'studio', 'room', 'house', 'dorm', 'all'];
const rentPeriods = [
  'academic year',
  'semester',
  'monthly',
  'weekly',
  'daily',
  'any',
];

function FilterItems({
  location,
  setLocation,
  priceRange,
  setPriceRange,
  category,
  setCategory,
  rentPeriod,
  setRentPeriod,
}) {
  const changePrice = (e, type) => {
    if (type === 'from') {
      setPriceRange((prev) => ({ ...prev, from: e.target.value }));
    } else if (type === 'to') {
      setPriceRange((prev) => ({ ...prev, to: e.target.value }));
    }
  };

  return (
    <div className="grid items-center gap-4 grid-cols-4 max-sm:grid-cols-2 w-full max-w-[80%] max-md:max-w-none max-sm:flex-wrap">
      <div className="pr-4 border-r-2 border-gray-400">
        <FilterInput
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="pr-4 border-r-2 max-sm:border-0 max-sm:pr-0 border-gray-400">
        <FilterSelect
          label="Price"
          value={
            priceRange.from != priceRange.to
              ? `${priceRange.from}DH-${priceRange.to}DH`
              : `${priceRange.from}DH`
          }
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-end">
              <span>From</span>
              <Input
                variant="static"
                value={priceRange.from}
                onChange={(e) => changePrice(e, 'from')}
                containerProps={{ className: '!w-[60px] !min-w-0 !h-8' }}
                type="text"
                inputMode="numeric"
                min={0}
                max={12000}
              />
            </div>
            <div className="flex justify-between items-end">
              <span>To</span>
              <Input
                variant="static"
                value={priceRange.to}
                onChange={(e) => changePrice(e, 'to')}
                containerProps={{ className: '!w-[60px] !min-w-0 !h-8' }}
                type="text"
                inputMode="numeric"
                min={0}
                max={12000}
              />
            </div>
          </div>
        </FilterSelect>
      </div>
      <div className="pr-4 border-r-2 border-gray-400 ">
        <FilterSelect
          label="Category"
          value={category}
          onChange={(value) => setCategory(value)}
        >
          {categories.map((category) => (
            <Option key={uuid()} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Option>
          ))}
        </FilterSelect>
      </div>
      <div>
        <FilterSelect
          label="Rent Period"
          value={rentPeriod}
          onChange={(value) => setRentPeriod(value)}
        >
          {rentPeriods.map((rentPeriod) => (
            <Option key={uuid()} value={rentPeriod}>
              {rentPeriod.charAt(0).toUpperCase() + rentPeriod.slice(1)}
            </Option>
          ))}
        </FilterSelect>
      </div>
    </div>
  );
}

FilterItems.propTypes = {
  location: propTypes.string,
  setLocation: propTypes.func,
  priceRange: propTypes.object,
  setPriceRange: propTypes.func,
  category: propTypes.string,
  setCategory: propTypes.func,
  rentPeriod: propTypes.string,
  setRentPeriod: propTypes.func,
};

export default FilterItems;
