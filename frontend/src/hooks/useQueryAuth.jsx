import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthProvider';
import { useQuery } from '@tanstack/react-query';

function useQueryAuth({ queryKey, url }) {
  const [authErrorCount, setAuthErrorCount] = useState(0);
  const { auth, refreshAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchListing = async () => {
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

  const { data, status, error } = useQuery({
    queryFn: fetchListing,
    queryKey: [...queryKey, auth?.accessToken],
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (
      status === 'error' &&
      (error?.response.status === 401 || error?.response.status === 403) &&
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

  return { data, status };
}

export default useQueryAuth;
