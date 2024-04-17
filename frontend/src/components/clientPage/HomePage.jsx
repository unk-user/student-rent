import ComboBox from '../ui/ComboBox';
import Searchbar from './Searchbar';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import { LiaBathSolid } from 'react-icons/lia';
import { LiaBedSolid } from 'react-icons/lia';

function HomePage() {
  const [rentalListings, setRentalListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [selectedRentalPeriod, setSelectedRentalPeriod] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);

  const { auth } = useContext(AuthContext);

  if (!auth) return <Navigate to="/" replace />;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoadingListings(true);
    const filtersArray = [
      { field: 'price', min: priceRange[0], max: priceRange[1] },
      { field: 'period', value: selectedRentalPeriod },
      { field: 'bedrooms', value: bedrooms },
      { field: 'bathrooms', value: bathrooms },
    ];

    try {
      const response = await axios.get(
        `${
          import.meta.env.REACT_APP_API_URI
        }student/listings?offset=0&filters=${JSON.stringify(filtersArray)}`,
        {
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      console.log(response.data);
      const totalListings = response.data.recomendedListings.concat(
        response.data.listings
      );
      setRentalListings(totalListings);
    } catch (error) {
      console.error(error);
    }
    setLoadingListings(false);
  };

  const applyFilters = () => {
    fetchListings();
  };

  const sortOptions = [
    { field: 'price', sort: 1, text: 'price low' },
    { field: 'price', sort: -1, text: 'price high' },
  ];

  return (
    <>
      <Sidebar
        selectedRentalPeriod={selectedRentalPeriod}
        setSelectedRentalPeriod={setSelectedRentalPeriod}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        bathrooms={bathrooms}
        setBathrooms={setBathrooms}
        handleClick={applyFilters}
      />
      <section className="flex px-2 flex-col flex-1 lg:ml-[308px]">
        <header className="py-4 flex w-min md:w-fit flex-wrap justify-end m-auto items-center gap-2">
          <Searchbar />
          <ComboBox
            options={(() =>
              sortOptions.map((option) => {
                return option.text;
              }))()}
            withSearch={false}
            className={'bg-white text-[1.1rem]'}
            label="sort by:"
          />
        </header>
        <div className="grid gap-10 py-2 px-6 md:grid-cols-2 md:gap-8 md:px-4 xl:grid-cols-3 xl:px-2 xl:gap-4 2xl:grid-cols-4">
          {rentalListings.map((listing, index) => (
            <div key={index}>
              <div className="w-full aspect-square bg-slate-500 rounded-2xl">
                image container
              </div>
              <ul className="px-2 py-1">
                <li className="flex items-center justify-between">
                  <p className='text-[#354FB8] font-semibold'>{`${listing.price}DH`}</p>
                  <div className="px-2 py-1 rounded-md bg-[#F6CA45]">
                    {listing.category}
                  </div>
                </li>
                <li className="flex justify-between mt-1">
                  <div className="flex flex-col">
                    <p>{listing.address}</p>
                    <p>{listing.city}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="flex  gap-1 items-center">
                      <LiaBathSolid className="text-2xl" />
                      {listing.bathrooms}
                    </span>
                    <span className="flex gap-1 items-center">
                      <LiaBedSolid className="text-2xl" />
                      {listing.rooms}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
