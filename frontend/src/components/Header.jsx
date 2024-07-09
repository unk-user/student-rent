import { AuthContext } from '@/context/AuthProvider';
import axiosInstance from '@/utils/axiosInstance';
import {
  Badge,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
} from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import {
  Cancel01Icon,
  Logout01Icon,
  Menu01Icon,
  Message02Icon,
  Notification01Icon,
  UserIcon,
} from 'hugeicons-react';
import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import profileSvg from '@/assets/blank-profile-picture-973460.svg';
import { ConversationContext } from '@/context/ConversationProvider';

function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const { onlineState } = useContext(ConversationContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

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

  const logoutMobile = () => {
    logoutMutation.mutate();
    setOpenDrawer(false);
  };

  return (
    <header className="bg-white">
      <div className="w-full flex items-center py-[10px] px-2 max-xl:px-10 max-md:px-8 max-w-[1432px] mx-auto max-sm:px-2">
        <h1 className="text-xl max-sm:text-lg font-medium text-dark-blue mr-6 max-sm:mr-4">
          UROOM
        </h1>
        <div className="flex gap-4 max-sm:text-sm max-sm:gap-3">
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
        </div>
        <div className="ml-auto flex items-center gap-4 max-md:hidden">
          <NavLink
            to="/tenant/messages"
            className={({ isActive }) =>
              [
                isActive ? 'text-blue-300' : '',
                'transition-colors duration-200',
              ].join(' ')
            }
          >
            <Message02Icon size={28} />
          </NavLink>
          <Menu placement="bottom-end" offset={13}>
            <MenuHandler>
              <Button
                variant="text"
                ripple={false}
                className="flex items-center rounded-full p-0 !overflow-visible"
              >
                <Badge
                  placement="top-end"
                  color="blue"
                  overlap="circular"
                  invisible={!onlineState}
                  withBorder
                >
                  <div className="overflow-hidden rounded-full bg-gray-600 w-[28px] aspect-square">
                    {auth?.user?.profilePicture?.url ? (
                      <img
                        src={auth?.user?.profilePicture?.url}
                        alt="profile"
                        className="object-cover"
                      />
                    ) : (
                      <img src={profileSvg} alt="profile" />
                    )}
                  </div>
                </Badge>
              </Button>
            </MenuHandler>
            <MenuList className="rounded-none p-2">
              <Button
                ripple={false}
                variant="text"
                size="sm"
                className="!rounded-[6px] !w-full flex !justify-start items-center gap-2"
                disabled={logoutMutation.isPending}
                onClick={() => navigate('/tenant/profile')}
              >
                <UserIcon />
                Profile
              </Button>
              <Button
                ripple={false}
                variant="text"
                size="sm"
                className="!rounded-[6px] !w-full flex !justify-start items-center gap-2"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <Logout01Icon />
                Logout
              </Button>
            </MenuList>
          </Menu>
        </div>
        <div className="hidden max-md:block ml-auto">
          <IconButton
            variant="text"
            size="sm"
            onClick={() => setOpenDrawer(true)}
            ripple={false}
            className="rounded-[4px]"
          >
            <Menu01Icon />
          </IconButton>
          <Drawer
            placement="top"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            className="py-2 px-8 max-sm:px-2"
          >
            <div className="w-full flex justify-end">
              <IconButton
                ripple={false}
                variant="text"
                size="sm"
                onClick={() => setOpenDrawer(false)}
                className="rounded-[4px]"
              >
                <Cancel01Icon />
              </IconButton>
            </div>
            <ul className="mx-auto max-w-[280px] flex flex-col gap-2">
              <li>
                <Link className="flex items-center gap-2 w-full py-1">
                  <div className="overflow-hidden rounded-full bg-gray-600 w-8 aspect-square">
                    {auth?.user?.profilePicture?.url ? (
                      <img
                        src={auth?.user?.profilePicture?.url}
                        alt="profile"
                        className="object-cover"
                      />
                    ) : (
                      <img src={profileSvg} alt="profile" />
                    )}
                  </div>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/tenant/messages"
                  className="flex items-center gap-2 w-full py-1"
                >
                  <Message02Icon size={32} />
                  Messages
                </Link>
              </li>
              <li>
                <Link className="flex items-center gap-2 w-full py-1">
                  <Notification01Icon size={32} />
                  Notifications
                </Link>
              </li>
              <li>
                <div
                  className="flex hover:cursor-pointer justify-start items-center gap-2 w-full py-1"
                  onClick={logoutMobile}
                >
                  <Logout01Icon size={32} />
                  Logout
                </div>
              </li>
            </ul>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

export default Header;
