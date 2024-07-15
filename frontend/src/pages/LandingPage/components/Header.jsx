import { AuthContext } from '@/context/AuthProvider';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import NavIcons from '@/components/NavIcons';
import MobileNavmenu from '@/components/MobileNavmenu';
import { Button } from '@material-tailwind/react';

function Header() {
  const isMobile = useMediaQuery({ query: '(max-width: 662px' });
  const navigate = useNavigate();

  const { auth, setAuth } = useContext(AuthContext);

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
        {isMobile ? <MobileNavmenu logoutMutation={logoutMutation} /> : ''}
        <Link
          to="/"
          className="text-xl max-sm:text-lg font-medium text-dark-blue mr-6 max-md:mr-4 max-sm:ml-2"
        >
          UROOM
        </Link>
        <div className="flex gap-4 max-sm:text-sm text-dark-blue max-sm:gap-3">
          {!isMobile ? (
            <>
              <NavLink
                to="/tenant/rent?page=1"
                className={({ isActive }) =>
                  [
                    isActive ? 'text-blue-300' : '',
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
                    isActive ? 'text-blue-300' : '',
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
        {auth?.accessToken ? (
          !isMobile ? (
            <NavIcons logoutMutation={logoutMutation} />
          ) : (
            ''
          )
        ) : (
          <div className="ml-auto flex items-center gap-2">
            {!isMobile ? (
              <Button
                size="sm"
                variant="outlined"
                color="blue"
                onClick={() => navigate('auth/signin')}
              >
                Login
              </Button>
            ) : (
              ''
            )}
            <Button
              size="sm"
              className="bg-blue-300 !border border-blue-300 "
              onClick={() => navigate('auth/signup')}
            >
              Signup
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
