import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useReducer, useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';
import axiosInstance from '../../utils/axiosInstance';
import { useInfiniteQuery } from '@tanstack/react-query';
import ComboBox from '../ui/ComboBox';
import Searchbar from './Searchbar';
import Sidebar from './Sidebar';
import ListingCard from './ListingCard';

function HomePage() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const sortOptions = [
    { field: 'price', sort: 1, text: 'price low' },
    { field: 'price', sort: -1, text: 'price high' },
  ];

  const placeHolderArray = Array.from({ length: 8 });
  const [sortOption, setSortOption] = useState(sortOptions[0]);
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
        case 'SET_CATEGORY':
          return {
            ...state,
            category: action.value,
          };
      }
    },
    {
      selectedRentalPeriod: 'All',
      priceRange: [0, 5000],
      bedrooms: 0,
      bathrooms: 0,
      category: 'All',
    }
  );

  useEffect(() => {
    if (!auth?.accessToken) return navigate('/', { replace: true });
  }, [auth, navigate]);

  const fetchListings = async ({ pageParam = 0 }) => {
    const response = await axiosInstance.get(
      `/student/listings?offset=${pageParam}`,
      {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      }
    );
    const listings = response.data.totalListings;
    const hasMoreListings = listings.length === 8;

    return {
      listings,
      pageParam,
      hasMoreListings,
    };
  };

  const { data, status } = useInfiniteQuery({
    queryKey: ['listings'],
    queryFn: fetchListings,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const applyCategory = (value) => {
    dispatch({ type: 'SET_CATEGORY', value: value });
  };

  const handleSelectSort = (value) => {
    setSortOption(sortOptions.find((option) => option.text === value));
  };

  if (!auth) return <Navigate to="/" replace />;
  return (
    <>
      <Sidebar
        filters={filters}
        dispatch={dispatch}
        // handleClick={applyFilters} IMPLEMENT SOON!!!
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
          {status === 'pending' ? (
            <div>Loading ...</div>
          ) : (
            data.pages.map((page) =>
              page.listings.map((listing) => (
                <Link key={listing._id} to={`${listing._id}`}>
                  <ListingCard listing={listing} />
                </Link>
              ))
            )
          )}
        </div>
      </section>
    </>
  );
}

export default HomePage;
