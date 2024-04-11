import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect } from 'react';

function ClientRoute() {
  useEffect(() => {
    console.log(document.cookie);
  });

  return (
    <article>
      <Navbar />
      <Outlet />
    </article>
  );
}

export default ClientRoute;
