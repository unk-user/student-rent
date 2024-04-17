import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './components/signupPage/Signup';
import Login from './components/loginPage/Login';
import { loginAction, logout, signupAction } from './utils/authActions';
import RootComponent from './components/RootComponent';
import ClientRoute from './components/clientPage/ClientLayout';
import AuthContext from './context/AuthProvider';
import { useContext } from 'react';
import axios from 'axios';
import authLoader from './utils/authLoader';
import HomePage from './components/clientPage/HomePage';

function App() {
  const authContext = useContext(AuthContext);
  axios.defaults.withCredentials = true;
  const router = createBrowserRouter([
    {
      path: '/',
      loader: authLoader({ authContext }),
      element: <RootComponent />,
    },
    {
      path: '/logout',
      loader: logout,
      element: <div>logout</div>,
    },
    {
      path: '/signup',
      action: signupAction({ authContext }),
      element: <Signup />,
    },
    {
      path: '/login',
      action: loginAction({ authContext }),
      element: <Login />,
    },
    {
      path: '/client',
      element: <ClientRoute />,
      children: [
        {
          path:'',
          element: <HomePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
