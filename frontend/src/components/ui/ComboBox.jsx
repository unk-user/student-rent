import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { RiExpandUpDownLine } from 'react-icons/ri';
import { CiSearch } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

function ComboBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const inputRef = useRef(null);
  const inputRadio = useRef(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const cityData = [
    'Casablanca',
    'Rabat',
    'Fes',
    'Tangier',
    'Marrakesh',
    'Sale',
    'Agadir',
    'Meknes',
    'Oujda',
    'Kenitra',
    'Tetouan',
    'Al Hoceima',
  ];

  const handleSelection = (e) => {
    inputRef.current.value = e.target.textContent
    setSelectedCity(e.target.textContent);
  };

  const filteredCities = cityData.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative w-fit">
      <Button
        className="text-ellipsis py-1 h-9 w-44 flex justify-between items-center"
        handleClick={handleButtonClick}
      >
        <div htmlFor="city" className='flex'>
          <input type="radio" className=' hidden' checked={true} id='city' name='city' value={selectedCity} readOnly ref={inputRadio}/>
          <p className=" leading-relaxed">{selectedCity || 'Select city'}</p>
        </div>
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
                placeholder="Search for more"
                onChange={handleSearchChange}
                value={searchQuery}
                className="w-full focus:outline-none px-1 py-1"
              />
            </div>
            {filteredCities.sort().map((city, index) => {
              return (
                index < 5 && (
                  <div
                    className={
                      'relative hover:bg-gray-200 rounded-md p-1 pl-3 h-8 mx-1'
                    }
                    key={index}
                    value={city}
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
