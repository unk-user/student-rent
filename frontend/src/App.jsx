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
import Layout from './pages/Tenant/Layout';

function App() {
  axios.defaults.withCredentials = true;
  const { auth } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        { path: 'signup', element: <RegisterForm /> },
        {
          path: 'signin',
          element: auth?.accessToken ? (
            <Navigate to="/tenant/rent" replace={true} />
          ) : (
            <LoginForm />
          ),
        },
      ],
    },
    {
      path: '/tenant',
      element: auth?.accessToken ? (
        <Layout />
      ) : (
        <Navigate to="/auth/signin" replace={true} />
      ),
      children: [
        {
          path: 'rent',
        },
        {
          path: 'roommates',
        },
        {
          path: 'messages'
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
