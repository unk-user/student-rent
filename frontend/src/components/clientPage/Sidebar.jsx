import RadioItem from '../ui/RadioItem';
import { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';
import NumberInput from '../ui/NumberInput';
import Button from '../ui/Button';
import { HiMenuAlt2 } from 'react-icons/hi';
import { motion } from 'framer-motion';

function Sidebar({
  selectedRentalPeriod,
  setSelectedRentalPeriod,
  priceRange,
  setPriceRange,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  handleClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sideBarRef = useRef();

  const handleOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if(!sideBarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function valueText(value) {
    return `${value}DH`;
  }

  const minDistance = 100;

  const handlePriceChange = (e, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;

    if (activeThumb === 0) {
      setPriceRange([
        Math.min(newValue[0], priceRange[1] - minDistance),
        priceRange[1],
      ]);
    } else {
      setPriceRange([
        priceRange[0],
        Math.max(newValue[1], priceRange[0] + minDistance),
      ]);
    }
  };

  const priceMarks = [
    { value: 0, label: '0DH' },
    { value: 4000, label: '4000DH' },
  ];

  const handlePeriodSelection = (e) => {
    setSelectedRentalPeriod(e.target.value);
  };

  return (
    <motion.aside
      animate={{ transitionDuration: '750ms' }}
      exit={{ }}
      className={`fixed h-full pl-2 pb-4 z-30 ${isOpen ? '' : 'max-lg:-ml-[309px]'}`}
    >
      <div ref={sideBarRef} className="w-[300px] h-full  relative flex flex-col rounded-xl px-4 py-4 bg-slate-50">
        <HiMenuAlt2
          onClick={handleOpen}
          className="lg:hidden absolute -right-9 top-6 text-3xl"
        />
        <header className="text-center">
          <h1>UROOM</h1>
        </header>
        <div className="mt-6">
          <h4>Filters</h4>
          <div className="flex flex-col mt-2">
            <h6>Rental period</h6>
            <div className="pl-2 mb-2">
              <RadioItem
                name={'rental-period'}
                value={'All'}
                selectedRole={selectedRentalPeriod}
                handleRoleSelection={handlePeriodSelection}
                label={'All'}
                index={0}
              />
              <RadioItem
                name={'rental-period'}
                value={'Monthly'}
                selectedRole={selectedRentalPeriod}
                handleRoleSelection={handlePeriodSelection}
                label={'Monthly'}
                index={1}
              />
              <RadioItem
                name={'rental-period'}
                value={'Yearly'}
                selectedRole={selectedRentalPeriod}
                handleRoleSelection={handlePeriodSelection}
                label={'Yearly'}
                index={2}
              />
            </div>
            <h6>Price range</h6>
            <div className="px-4">
              <Slider
                getAriaLabel={() => 'Minimum distance'}
                step={50}
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                getAriaValueText={valueText}
                disableSwap
                marks={priceMarks}
                max={4000}
                sx={{
                  '& .MuiSlider-track': {
                    color: '#354FB8',
                  },
                  '& .MuiSlider-thumb': {
                    color: '#354FB8',
                  },
                  '& .MuiSlider-valueLabel': {
                    fontSize: '1rem',
                    fontFamily: 'Rubik',
                  },
                  '& .MuiSlider-markLabel': {
                    fontFamily: 'Rubik',
                  },
                  '& .MuiSlider-rail': {
                    height: '6px',
                  },
                  '& .MuiSlider-mark': {
                    color: 'transparent',
                  },
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-8">
              <div>
                <label htmlFor="bedrooms-number">
                  <h6>Bedrooms</h6>
                </label>
                <NumberInput
                  value={bedrooms}
                  id={'bedrooms-number'}
                  setValue={setBedrooms}
                />
              </div>
              <div>
                <label htmlFor="bathrooms-number">
                  <h6>Bathrooms</h6>
                </label>
                <NumberInput
                  value={bathrooms}
                  id={'bathrooms-number'}
                  setValue={setBathrooms}
                />
              </div>
            </div>
            <Button
              type="button"
              handleClick={handleClick}
              className={'bg-[#354FB8] text-white text-[1.2rem] mt-4'}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
