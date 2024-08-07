import { AuthContext } from '@/context/AuthProvider';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import NavIcons from './NavIcons';
import MobileNavmenu from './MobileNavmenu';

function Header() {
  const isDesktop = useMediaQuery({ query: '(min-width: 668px)' });

  const { setAuth } = useContext(AuthContext);

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/logout', {
        credentials: 'include',
      });
      return data;
    },
    onSuccess: () => {
      setAuth(null);
      window.location.reload();
    },
  });

  return (
    <header className="bg-white sticky top-0 z-40">
      <div className="w-full flex items-center py-[10px] px-2 max-xl:px-8 max-md:px-4 max-w-[1432px] mx-auto max-sm:px-2">
        <Link
          to="/"
          className="text-xl max-sm:text-lg font-medium text-dark-blue mr-6 max-sm:mr-4"
        >
          UROOM
        </Link>
        <div className="flex gap-4 max-sm:text-sm max-sm:gap-3">
          {isDesktop ? (
            <>
              <NavLink
                to="/tenant/rent?page=1"
                className={({ isActive }) =>
                  [
                    isActive ? 'text-blue-300' : 'text-dark-blue',
                    'transition-colors duration-200',
                  ].join(' ')
                }
              >
                Find Rent
              </NavLink>
              <NavLink
                to="/tenant/roommates"
                className={({ isActive }) =>
                  [
                    isActive ? 'text-blue-300' : 'text-dark-blue',
                    'transition-colors duration-200',
                  ].join(' ')
                }
              >
                Find Roommates
              </NavLink>
            </>
          ) : (
            ''
          )}
        </div>
        {isDesktop ? (
          <NavIcons logoutMutation={logoutMutation} />
        ) : (
          <span className='ml-auto'>
            <MobileNavmenu logoutMutation={logoutMutation} />
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
