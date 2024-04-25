import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

function RootComponent() {
  const { auth, refreshAccessToken, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   refreshAccessToken();
  //   if (!auth) navigate('/login', { replace: true });
  //   else navigate(`/${auth.role}`, { replace: true });
  // }, [refreshAccessToken, auth, navigate]);

  useEffect(() => {
    if (auth) return navigate(`/${auth.role}`, { replace: true });
  }, [auth, navigate]);

  const { status, failureCount } = useQuery({
    queryKey: ['refreshToken'],
    queryFn: refreshAccessToken,
    enabled: !auth,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  if (status === 'loading' || status === 'pending')
    return <div>Loading...</div>;

  if (status === 'error' && failureCount > 2) {
    console.log('error');
    setAuth(null);
    return <Navigate to="/login" replace={true} />;
  }
}

export default RootComponent;
