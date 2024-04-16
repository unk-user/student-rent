import ComboBox from '../ui/ComboBox';
import { IoIosSearch } from 'react-icons/io';

function Searchbar() {
  return (
    <div className="flex items-center h-11 rounded-md py-2 px-2 bg-white max-w-[480px]">
      <IoIosSearch className="text-[1.7rem]" />
      <input
        type="text"
        className="h-10 py-2 px-2 flex-1 text-[1.2rem] outline-none"
        placeholder="Search here"
      /><div className='h-9'>
        
        <ComboBox
          options={['All', 'Room', 'Appartement', 'Studio']}
          initialValue='All'
          className={'bg-[#F6CA45] text-[1.1rem]'}
          withSearch={false}
        />
      </div>
    </div>
  );
}

export default Searchbar;
