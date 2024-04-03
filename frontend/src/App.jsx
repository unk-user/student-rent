import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './routes/Signup';
import Login from './routes/Login';
import { loginAction, signupAction } from './utils/authActions';
import { isAuthenticated } from './utils/rootLoader';
import useAuthenticate from './hooks/useAuthenticate';
import RootComponent from './components/RootComponent';
import ClientRoute from './routes/ClientLayout';

function App() {
  const { registerUser, loginUser } = useAuthenticate();


  const router = createBrowserRouter([
    {
      path: '/',
      loader: isAuthenticated,
      element: <RootComponent />
    },
    {
      path: '/signup',
      action: signupAction({ registerUser }),
      element: <Signup />,
    },
    {
      path: '/login',
      action: loginAction({ loginUser }),
      element: <Login />,
    },
    {
      path: '/client',
      element: <ClientRoute />
    },
  ]);

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
