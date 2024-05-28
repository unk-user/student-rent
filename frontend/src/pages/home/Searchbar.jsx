import ComboBox from '@src/components/ComboBox';
import { IoIosSearch } from 'react-icons/io';
import PropTypes from 'prop-types';

function Searchbar({ setFilters }) {
  const handleChange = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, category: value }));
  };

  return (
    <div className="flex items-center h-11 rounded-lg py-2 px-2 bg-white max-w-[480px]">
      <IoIosSearch className="text-[1.7rem]" />
      <input
        type="text"
        className="h-10 py-2 px-2 flex-1 text-[1.2rem] outline-none max-sm:w-48"
        placeholder="Search here"
      />
      <div className="h-9">
        <ComboBox
          options={['All', 'Room', 'Appartment', 'Studio']}
          initialValue="All"
          className={'bg-[#F6CA45] text-[1.1rem] max-sm:w-24'}
          withSearch={false}
          handleChange={(value) => handleChange(value)}
        />
      </div>
    </div>
  );
}

Searchbar.propTypes = {
  setFilters: PropTypes.func,
};

export default Searchbar;