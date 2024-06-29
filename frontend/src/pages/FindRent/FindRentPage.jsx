import FilterBar from '@/components/FilterBar';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ListingCard from './components/ListingCard';
import Pagination from './components/Pagination';

function FindRentPage() {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    location: 'Any',
    category: 'all',
    rentPeriod: 'any',
  });
  const [page, setPage] = useState(1);

  const queryOptions = { page };
  if (filters.minPrice) queryOptions.minPrice = filters.minPrice;
  if (filters.maxPrice) queryOptions.maxPrice = filters.maxPrice;
  if (filters.location !== 'Any' && filters.location)
    queryOptions.location = filters.location;
  if (filters.category !== 'all') queryOptions.category = filters.category;
  if (filters.rentPeriod !== 'any')
    queryOptions.rentPeriod = filters.rentPeriod;

  const queryParams = new URLSearchParams(queryOptions).toString();

  const query = useQuery({
    queryKey: ['getListings', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/client/listings?${queryParams}`
      );
      return data;
    },
  });

  return (
    <div className="w-full h-full px-[98px] py-6 max-w-[1400px] mx-auto max-xl:px-12 max-xs:px-6">
      <FilterBar filters={filters} setFilters={setFilters} />
      <section className="grid grid-cols-4 gap-[20px] mb-4 mt-6 w-full max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {query.data?.listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </section>
      {query?.data?.listings.length > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={query?.data?.totalPages}
        />
      )}
    </div>
  );
}

export default FindRentPage;
