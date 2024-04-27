import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function useInfiniteListingsQuery({ filters, sortOption }) {
  const { auth, refreshAccessToken } = useContext(AuthContext);
  const [authErrorCount, setAuthErrorCount] = useState(0);
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
        const newAuth = await refreshAccessToken();
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

  const {
    data,
    status,
    fetchStatus,
    fetchNextPage,
    hasNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
    queryFn: fetchListings,
    queryKey: ['rental-listings', filters, sortOption, auth?.accessToken],
    initialPageParam: 0,
    retry: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.totalListings.length === 12 ? lastPageParam + 12 : null,
  });

  useEffect(() => {
    if (
      status === 'error' &&
      error?.response.status === 401 &&
      authErrorCount < 2
    ) {
      console.log(authErrorCount);
      setAuthErrorCount((prevCount) => prevCount + 1);
      refreshAccessToken();
    } else if (status === 'error' && authErrorCount > 1) {
      navigate('/login', { replace: true });
    } else if (status === 'success') {
      setAuthErrorCount(0);
    }
  }, [status, navigate, error, refreshAccessToken, authErrorCount]);

  useEffect(() => {
    if (inView && hasNextPage && status === 'success') {
      fetchNextPage();
      setInView(false);
    }
  }, [inView, fetchNextPage, hasNextPage, status]);

  return { data, setInView, fetchStatus, refetch };
}
