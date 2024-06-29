import { AuthContext } from '@/context/AuthProvider';
import {
  Avatar,
  Badge,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@material-tailwind/react';
import { Logout02Icon, Message02Icon, Notification01Icon } from 'hugeicons-react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  const { auth } = useContext(AuthContext);

  return (
    <header className="bg-white">
      <div className="w-full flex items-center py-[10px] px-2 sm:px-4 max-w-[1600px] mx-auto">
        <h1 className="text-xl font-medium text-dark-blue mr-6">UROOM</h1>
        <div className="flex gap-4">
          <NavLink
            to="/tenant/rent"
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
        <div className="ml-auto flex gap-4">
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
          <Notification01Icon size={28} />
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
                  withBorder
                >
                  <Avatar
                    src={auth?.user?.profilePicture?.url}
                    size="xs"
                    className="bg-gray-600 w-[28px] h-[28px]"
                  />
                </Badge>
              </Button>
            </MenuHandler>
            <MenuList className="rounded-none border-0 p-1">
              <MenuItem className="rounded-[6px] flex items-center gap-2 px-2">
                <Logout02Icon />
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
