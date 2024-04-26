import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function useInfiniteListingsQuery({ filters, sortOption }) {
  const { auth, refreshAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inView, setInView] = useState(false);

  const filtersArray = [
    {
      field: 'price',
      min: filters.priceRange[0],
      max: filters.priceRange[1],
    },
    { field: 'period', value: filters.selectedRentalPeriod },
    { field: 'bedrooms', value: filters.bedrooms },
    { field: 'bathrooms', value: filters.bathrooms },
    { field: 'category', value: filters.category },
  ];

  const fetchListings = async ({ pageParam }) => {
    const url = `/student/listings?offset=${pageParam}&filters=${JSON.stringify(
      filtersArray
    )}&sort=${JSON.stringify(sortOption)}`;
    if (!auth) {
      try {
        const newAuth = refreshAccessToken();
        const response = await axiosInstance(url, {
          headers: { Authorization: `Bearer ${newAuth.accessToken}` },
        });
        return response.data;
      } catch (refreshError) {
        navigate('/login');
      }
    }
    const response = await axiosInstance(url, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
    return response.data;
  };

  const { data, status, fetchStatus, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryFn: fetchListings,
      queryKey: ['rental-listings', filters, sortOption],
      initialPageParam: 0,
      retry: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.totalListings.length === 12 ? lastPageParam + 12 : null,
    });

  useEffect(() => {
    if (status === 'error') return navigate('/login');
  }, [status, navigate]);

  useEffect(() => {
    if (inView && hasNextPage && status === 'success') {
      console.log('trying to fetch next page');
      fetchNextPage();
      setInView(false);
    }
  }, [inView, fetchNextPage, hasNextPage, status]);

  return { data, setInView, fetchStatus, refetch };
}
