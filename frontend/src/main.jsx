import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './routes/SignUp.jsx';
import './index.css';
import SignIn from './routes/SignIn.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/Signup',
    element: <SignUp />,
  },
  {
    path: '/SignIn',
    element: <SignIn />
  },
  {
    path: '/private',
    element: <PrivateRoute />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
