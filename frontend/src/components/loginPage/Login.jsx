import { Link, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';

function Login() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(auth) {
      return navigate('/');
    }
  }, [auth, navigate]);
  
  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <LoginForm />
      <Link to="/">Home</Link>
    </main>
  );
}

export default Login;
