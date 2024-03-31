import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { RiExpandUpDownLine } from 'react-icons/ri';
import { CiSearch } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

function ComboBox({ formData, setFormData, cities }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCity = formData.city;
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCities = cities.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelection = (e) => {
    setFormData({
      ...formData,
      city: e.target.textContent,
    });
    setIsOpen(!isOpen);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative w-fit">
      <Button
        className="text-ellipsis py-1 h-8 w-44 flex justify-between items-center"
        handleClick={handleButtonClick}
      >
        <p className=" leading-relaxed">{selectedCity || 'Select city'}</p>
        <RiExpandUpDownLine />
      </Button>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute bg-gray-100 w-full mt-1 py-1 box-border rounded-md flex flex-col gap-1 scrollbar-thumb-gray-800"
          >
            <div className="w-f flex items-center gap-1 px-1 pb-1 border-b-2 border-black">
              <CiSearch className="w-6 h-5" />
              <input
                ref={inputRef}
                type="text"
                maxLength={30}
                placeholder='Search for more'
                onChange={handleSearchChange}
                value={searchQuery}
                className="w-full focus:outline-none px-1 py-1"
              />
            </div>
            {filteredCities.map((city, index) => {
              return (
                index < 5 && (
                  <div
                    className={
                      'relative hover:bg-gray-200 rounded-md p-1 pl-3 h-8 mx-1'
                    }
                    key={city}
                    onClick={handleSelection}
                  >
                    {selectedCity === city && (
                      <FaCheck className="absolute w-3 top-1/2 -translate-y-1/2 right-2" />
                    )}
                    <p className="leading-snug">{city}</p>
                  </div>
                )
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ComboBox;

ComboBox.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  cities: PropTypes.array,
};
