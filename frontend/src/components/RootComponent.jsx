import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

function RootComponent() {
  const { auth, refreshAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    refreshAccessToken();
    if (!auth) navigate('/login', { replace: true });
    else navigate(`/${auth.role}`, { replace: true });
  }, [refreshAccessToken, auth, navigate]);
}

export default RootComponent;
