import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './routes/Signup';
import Login from './routes/Login';
import { loginAction, signupAction } from './utils/authActions';
import useAuthenticate from './hooks/useAuthenticate';

function App() {
  const { registerUser, loginUser } = useAuthenticate();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <div>Home</div>,
    },
    {
      path: '/Signup',
      action: signupAction({ registerUser }),
      element: <Signup />,
    },
    {
      path: '/SignIn',
      action: loginAction({ loginUser }),
      element: <Login />,
    },
  ]);

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
