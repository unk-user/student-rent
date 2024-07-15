import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './pages/auth/AuthLayout';
import LoginForm from './pages/auth/components/LoginForm';
import RegisterForm from './pages/auth/components/RegisterForm';
import { Suspense, lazy, useContext } from 'react';
import { AuthContext } from './context/AuthProvider';
import Layout from './pages/Tenant/Layout';
import FindRentPage from './pages/FindRent/FindRentPage';
import PropertyPage from './pages/PropertyPage/PropertyPage';
import FindRoommatesPage from './pages/FindRoommates/FindRoommatesPage';
import ConversationProvider from './context/ConversationProvider';
import { Spinner } from '@material-tailwind/react';
import ChatLayout from './pages/Messages/ChatLayout';
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  axios.defaults.withCredentials = true;
  const { auth } = useContext(AuthContext);

  const Chat = lazy(() => import('./pages/Messages/components/Chat'));
  const NewChat = lazy(() => import('./pages/Messages/components/NewChat'));

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
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
      element:
        auth?.accessToken !== null ? (
          <Layout />
        ) : (
          <Navigate to="/auth/signin" replace={true} />
        ),
      children: [
        {
          path: 'rent',
          element: <FindRentPage />,
        },
        {
          path: 'rent/:listingId',
          element: <PropertyPage />,
        },
        {
          path: 'roommates',
          element: <FindRoommatesPage />,
          children: [
            {
              path: 'best-matches',
              element: <div>Best Matches</div>,
            },
            {
              path: 'most-recent',
              element: <div>Most Recent</div>,
            },
            {
              path: 'saved-posts',
              element: <div>Saved Posts</div>,
            },
            {
              path: 'my-posts',
              element: <div>My Posts</div>,
            },
          ],
        },
        {
          path: 'messages',
          element: <ChatLayout />,
          children: [
            {
              path: ':conversationId',
              element: <Chat />,
            },
            {
              path: 'new/:userId',
              element: <NewChat />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ConversationProvider>
      <Suspense
        fallback={
          <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ConversationProvider>
  );
}

export default App;
