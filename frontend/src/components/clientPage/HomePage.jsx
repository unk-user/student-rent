import ComboBox from '../ui/ComboBox';
import Searchbar from './Searchbar';
import { Navigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  useEffect,
  useState,
  useContext,
  useCallback,
  useReducer,
} from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import ListingCard from './ListingCard';

function HomePage() {
  const { auth } = useContext(AuthContext);
  const sortOptions = [
    { field: 'price', sort: 1, text: 'price low' },
    { field: 'price', sort: -1, text: 'price high' },
  ];

  const [rentalListings, setRentalListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreListings, setHasMoreListings] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const placeHolderArray = ['', '', '', '', '', '', '', ''];

  const [filters, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_RENTAL_PERIOD':
          return {
            ...state,
            selectedRentalPeriod: action.value,
          };
        case 'SET_PRICE_RANGE':
          return {
            ...state,
            priceRange: action.value,
          };
        case 'SET_BEDROOMS':
          return {
            ...state,
            bedrooms: action.value,
          };
        case 'SET_BATHROOMS':
          return {
            ...state,
            bathrooms: action.value,
          };
      }
    },
    {
      selectedRentalPeriod: 'All',
      priceRange: [0, 5000],
      bedrooms: 0,
      bathrooms: 0,
    }
  );

  const [category, setCategory] = useState('All');

  const fetchListings = useCallback(async () => {
    const filtersArray = [
      {
        field: 'price',
        min: filters.priceRange[0],
        max: filters.priceRange[1],
      },
      { field: 'period', value: filters.selectedRentalPeriod },
      { field: 'bedrooms', value: filters.bedrooms },
      { field: 'bathrooms', value: filters.bathrooms },
      { field: 'category', value: category },
    ];

    if (!auth) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URI}student/listings?offset=${
          (currentPage - 1) * 8
        }&filters=${JSON.stringify(filtersArray)}&sort=${JSON.stringify(
          sortOption
        )}`,
        {
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      console.log(response.data);
      const totalListings =
        currentPage === 1
          ? response.data.recomendedListings.concat(response.data.listings)
          : response.data.listings;
      setRentalListings((prevListings) => [...prevListings, ...totalListings]);
      setHasMoreListings(
        totalListings.length === 8 + response.data.recomendedListings.length
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    category,
    currentPage,
    auth,
    setRentalListings,
    setHasMoreListings,
    sortOption,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight && hasMoreListings) {
        fetchListings();
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    const initialFetch = () => {
      if (currentPage === 1) {
        setRentalListings([]);
        setCurrentPage(2);
        fetchListings();
      }
    };

    initialFetch();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [category, currentPage, fetchListings, hasMoreListings, sortOption]);

  if (!auth) return <Navigate to="/" replace />;

  const applyFilters = () => {
    setCurrentPage(1);
  };
  const applyCategory = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleSelectSort = (value) => {
    setSortOption(sortOptions.find((option) => option.text === value));
    setCurrentPage(1);
  };

  return (
    <>
      <Sidebar
        filters={filters}
        dispatch={dispatch}
        handleClick={applyFilters}
      />
      <section className="flex px-2 flex-col flex-1 lg:ml-[308px]">
        <header className="py-4 flex w-min md:w-fit flex-wrap justify-end m-auto items-center gap-2">
          <Searchbar applyCategory={applyCategory} />
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
          {rentalListings.map((listing) => (
            <Link key={listing._id} to={`${listing._id}`}>
              <ListingCard listing={listing} />
            </Link>
          ))}
          {loading &&
            placeHolderArray.map((_, index) => (
              <div key={index}>
                <ListingCard listing={{}} />
              </div>
            ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
