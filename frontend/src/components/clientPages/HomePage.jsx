import { Link } from 'react-router-dom';
import { useState } from 'react';
import ComboBox from '../ui/ComboBox';
import Searchbar from './Searchbar';
import Sidebar from './Sidebar';
import ListingCard from './ListingCard';
import useInfiniteListingsQuery from '../../hooks/useInfiniteListingsQuery';
import { useInView } from 'react-intersection-observer';
import { v4 as uuidV4 } from 'uuid';

function HomePage() {
  const { ref } = useInView({
    onChange: (inView) => {
      setInView(inView);
    },
  });

  const [filters, setFilters] = useState({
    selectedRentalPeriod: 'All',
    priceRange: [0, 5000],
    bedrooms: 0,
    bathrooms: 0,
    category: 'All',
  });

  const sortOptions = [
    { field: 'price', sort: 1, text: 'price low' },
    { field: 'price', sort: -1, text: 'price high' },
  ];
  const [sortOption, setSortOption] = useState(sortOptions[0]);

  const { data, setInView, fetchStatus } = useInfiniteListingsQuery({
    filters,
    sortOption,
  });

  const handleSelectSort = (value) => {
    setSortOption(sortOptions.find((option) => option.text === value));
  };

  return (
    <>
      <Sidebar setFilters={setFilters} />
      <section className="flex px-2 flex-col flex-1 lg:ml-[308px]">
        <header className="py-4 flex w-min md:w-fit flex-wrap justify-end m-auto items-center gap-2">
          <Searchbar setFilters={setFilters} />
          <ComboBox
            options={(() =>
              sortOptions.map((option) => {
                return option.text;
              }))()}
            withSearch={false}
            handleChange={(value) => handleSelectSort(value)}
            className={'bg-white text-[1.1rem]'}
            label="sort by:"
          />
        </header>
        <div className="grid gap-10 py-2 px-6 md:grid-cols-2 md:gap-6 md:px-4 xl:grid-cols-3 xl:px-6 xl:gap-4 2xl:grid-cols-4 2xl:gap-6">
          {!!data &&
            data.pages.map((page) =>
              page.totalListings.map((listing) => (
                <Link key={listing._id} to={`${listing._id}`}>
                  <ListingCard listing={listing} />
                </Link>
              ))
            )}
          {fetchStatus === 'fetching' &&
            Array.from({ length: 12 }).map(() => (
              <div key={uuidV4()}>
                <ListingCard listing={{}} />
              </div>
            ))}
        </div>
        <div ref={ref} className="h-4 w-full bg-red-500" />
      </section>
    </>
  );
}

export default HomePage;
