import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './pages/auth/AuthLayout';
import LoginForm from './pages/auth/components/LoginForm';
import RegisterForm from './pages/auth/components/RegisterForm';

function App() {
  axios.defaults.withCredentials = true;

  const router = createBrowserRouter([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        { path: 'signin', element: <LoginForm /> },
        { path: 'signup', element: <RegisterForm /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
