import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

function RootComponent() {
  const { auth, refreshAccessToken, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const { status, failureCount, data } = useQuery({
    queryKey: ['refreshToken'],
    queryFn: refreshAccessToken,
    enabled: !auth,
    retry: 2,
    retryDelay: 200,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (auth || data) return navigate(`/${auth.role}`, { replace: true });
  }, [auth, navigate, data]);

  if (status === 'loading' || status === 'pending')
    return <div>Loading...</div>;

  if (status === 'error' && failureCount > 2) {
    console.log('error');
    setAuth(null);
    return <Navigate to="/login" replace={true} />;
  }

  if (auth) return <Navigate to={`/${auth.role}`} />;
}

export default RootComponent;
