import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './components/signupPage/Signup';
import Login from './components/loginPage/Login';
import { loginAction, logout, signupAction } from './utils/authActions';
import RootComponent from './components/RootComponent';
import ClientRoute from './components/clientPages/ClientLayout';
import AuthContext from './context/AuthProvider';
import { useContext } from 'react';
import axios from 'axios';
import HomePage from './components/clientPages/HomePage';
import ListingPage from './components/ListingPage/ListingPage';
import LandlordLayout from './components/landlordPages/LandlordLayout';
import PropertiesPage from './components/landlordPages/PropertiesPage';
import PropertyDetailsPage from './components/landlordPages/PropertyDetailsPage';
import EditProperty from './components/landlordPages/EditProperty';

function App() {
  const authContext = useContext(AuthContext);
  axios.defaults.withCredentials = true;
  const router = createBrowserRouter([
    {
      path: '/',
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
          path: '',
          element: <HomePage />,
        },
        {
          path: ':listingId',
          element: <ListingPage />,
        },
      ],
    },
    {
      path: '/landlord',
      element: <LandlordLayout />,
      children: [
        {
          path: 'properties',
          element: <PropertiesPage />,
          children: [{ path: ':propertyId', element: <PropertyDetailsPage /> }],
        },
        { path: 'edit', element: <EditProperty /> },
        { path: 'edit/:propertyId', element: <EditProperty /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
