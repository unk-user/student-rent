import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useMediaQuery } from '@mui/material';
import MobileNavbar from './MobileNavbar';
import Header from './Header';
import DataNavbarWrapper from './DataNavbarWrapper';
import { useMemo, useState } from 'react';
import useQueryAuth from '../../hooks/useQueryAuth';
import DataNavbar from './DataNavbar';

function LandlordLayout() {
  const isMobile = useMediaQuery('(max-width: 768px');
  const location = useLocation();
  const url = useMemo(() => {
    switch (location.pathname.split('/')[2]) {
      case 'properties':
        return '/listings';
    }
  }, [location]);

  const { data, status, error } = useQueryAuth({
    queryKey: ['dashboard', url],
    url: `landlord${url}`,
    role: 'landlord',
  });

  return (
    <article className="h-max relative flex">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <DataNavbarWrapper>
        <DataNavbar
          status={status}
          data={data}
          location={location.pathname.split('/')[2]}
        />
      </DataNavbarWrapper>
      <div className="flex-1 flex flex-col rounded-r-xl max-md:rounded-t-xl min-h-screen">
        <Header />
        <Outlet />
      </div>
    </article>
  );
}

export default LandlordLayout;
