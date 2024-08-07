import FilterBar from '@/components/FilterBar';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ListingCard from '../../components/ListingCard';
import Pagination from '../../components/Pagination';
import { uniqueId } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import TransparentLayoutWrapper from '@/components/TransparentLayoutWrapper';

function FindRentPage() {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    location: 'Any',
    category: 'all',
    rentPeriod: 'any',
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePagination = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  const queryOptions = { page: Number(searchParams.get('page')) || 1 };
  if (filters.minPrice) queryOptions.minPrice = filters.minPrice;
  if (filters.maxPrice) queryOptions.maxPrice = filters.maxPrice;
  if (filters.location !== 'Any' && filters.location)
    queryOptions.location = filters.location;
  if (filters.category !== 'all') queryOptions.category = filters.category;
  if (filters.rentPeriod !== 'any')
    queryOptions.rentPeriod = filters.rentPeriod;

  const queryParams = new URLSearchParams(queryOptions).toString();

  const query = useQuery({
    queryKey: ['getListings', filters, searchParams.get('page')],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/client/listings?${queryParams}`
      );
      return data;
    },
  });

  return (
    <TransparentLayoutWrapper>
      <FilterBar filters={filters} setFilters={setFilters} />
      <section className="grid grid-cols-4 gap-[20px] mb-4 mt-6 w-full max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {query.status === 'success' ? (
          query.data?.listings.length > 0 ? (
            query.data?.listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          ) : (
            <div className="w-full">
              <h4 className="text-lg font-medium">Oops! No results found.</h4>
              <p>
                <span
                  className="hover:underline hover:cursor-pointer text-blue-300"
                  onClick={() =>
                    setFilters({
                      minPrice: 0,
                      maxPrice: 5000,
                      location: 'Any',
                      category: 'all',
                      rentPeriod: 'any',
                    })
                  }
                >
                  Reset Filters
                </span>{' '}
                and try again
              </p>
            </div>
          )
        ) : (
          query.status === 'pending' &&
          Array.from({ length: 16 }, () => (
            <div key={uniqueId()} className="animate-pulse bg-white">
              <div className="w-full aspect-[5/4] bg-gray-300"></div>
              <div className="px-3 pt-4 pb-5 h-[140px]">
                <div className="w-full h-5 bg-gray-300"></div>
                <div className="w-3/5 h-5 bg-gray-300 mt-2"></div>
                <div className="w-full h-4 bg-gray-300 mt-12"></div>
              </div>
            </div>
          ))
        )}
      </section>
      {query?.data?.listings.length > 0 && (
        <Pagination
          page={Number(searchParams.get('page')) || 1}
          setPage={handlePagination}
          totalPages={query?.data?.totalPages}
        />
      )}
    </TransparentLayoutWrapper>
  );
}

export default FindRentPage;
