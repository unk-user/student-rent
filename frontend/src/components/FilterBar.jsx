import { useState } from 'react';
import { Button, Drawer } from '@material-tailwind/react';
import propTypes from 'prop-types';
import { MoreVerticalCircle01Icon } from 'hugeicons-react';
import FilterItems from './FilterItems';

function FilterBar({ filters, setFilters }) {
  const [location, setLocation] = useState(filters.location);
  const [priceRange, setPriceRange] = useState({
    from: filters.minPrice,
    to: filters.maxPrice,
  });
  const [category, setCategory] = useState(filters.category);
  const [rentPeriod, setRentPeriod] = useState(filters.rentPeriod);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClick = () => {
    setFilters({
      minPrice: parseInt(priceRange.from),
      maxPrice: parseInt(priceRange.to),
      location,
      category,
      rentPeriod,
    });
  };

  return (
    <div>
      <div className="bg-white w-full px-6 py-[18px] max-md:gap-4 max-md:hidden flex items-center">
        <FilterItems
          location={location}
          setLocation={setLocation}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          category={category}
          setCategory={setCategory}
          rentPeriod={rentPeriod}
          setRentPeriod={setRentPeriod}
        />
        <Button
          onClick={handleClick}
          className="text-sm p-[10px] bg-dark-blue rounded-[6px] shadow-none hover:shadow-none focus:opacity-100 ml-auto"
        >
          Apply Filters
        </Button>
      </div>
      <div className="hidden max-md:block">
        <Button
          variant="outlined"
          size='sm'
          className="text-sm rounded-[6px] flex items-center gap-1"
          onClick={() => setOpenDrawer(true)}
        >
          <MoreVerticalCircle01Icon />
          Filters
        </Button>
        <Drawer
          open={openDrawer}
          placement="bottom"
          overlayProps={{ className: '!fixed' }}
          onClose={() => setOpenDrawer(false)}
          className="p-4 py-4 !h-max"
        >
          <FilterItems
            location={location}
            setLocation={setLocation}
            rentPeriod={rentPeriod}
            setRentPeriod={setRentPeriod}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          <div className="w-full flex mt-6">
            <Button
              onClick={handleClick}
              className="text-sm p-[10px] bg-dark-blue rounded-[6px] shadow-none hover:shadow-none focus:opacity-100 ml-auto"
            >
              Apply Filters
            </Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  filters: propTypes.object,
  setFilters: propTypes.func,
};

export default FilterBar;
