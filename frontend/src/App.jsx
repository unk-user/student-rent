import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './pages/auth/AuthLayout';
import LoginForm from './pages/auth/components/LoginForm';
import RegisterForm from './pages/auth/components/RegisterForm';
import { useContext } from 'react';
import { AuthContext } from './context/AuthProvider';

function App() {
  axios.defaults.withCredentials = true;
  const { auth } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: 'signin',
          element: auth?.accessToken ? (
            <Navigate to="/tenant/rent" replace={true} />
          ) : (
            <LoginForm />
          ),
        },
        { path: 'signup', element: <RegisterForm /> },
      ],
    },
    {
      path: 'tenant',
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
