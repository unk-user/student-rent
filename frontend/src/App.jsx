import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './pages/signupPage/Signup';
import Login from './pages/loginPage/Login';
import { loginAction, logout, signupAction } from './utils/authActions';
import RootComponent from './components/RootComponent';
import ClientRoute from './student/components/ClientLayout';
import AuthContext from './context/AuthProvider';
import { useContext } from 'react';
import axios from 'axios';
import HomePage from './student/pages/home/HomePage';
import ListingPage from './student/pages/listing/ListingPage';
import LandlordLayout from './landlord/components/LandlordLayout';
import PropertiesPage from './landlord/pages/property-details/PropertiesPage';
import PropertyDetailsPage from './landlord/pages/property-details/PropertyDetailsPage';
import EditProperty from './landlord/pages/property-edit/EditProperty';

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
