import { Drawer, IconButton } from '@material-tailwind/react';
import { Cancel01Icon, Menu01Icon } from 'hugeicons-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import propTypes from 'prop-types';

function MobileNavmenu({ logoutMutation }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const logoutMobile = () => {
    logoutMutation.mutate();
    setOpenDrawer(false);
  };

  return (
    <div>
      <IconButton
        variant="text"
        size="sm"
        onClick={() => setOpenDrawer(true)}
        ripple={false}
        className="rounded-none"
      >
        <Menu01Icon />
      </IconButton>
      <Drawer
        size={240}
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
          <li className="py-1">
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
          </li>
          <li className="py-1">
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
          </li>
          <li className="py-1">
            <NavLink
              to="/tenant/messages"
              className={({ isActive }) =>
                [
                  isActive ? 'text-blue-300' : 'text-dark-blue',
                  'transition-colors duration-200',
                ].join(' ')
              }
            >
              Messages
            </NavLink>
          </li>
          <li className="hover:cursor-pointer py-1 text-dark-blue">
            <div onClick={logoutMobile}>Logout</div>
          </li>
        </ul>
      </Drawer>
    </div>
  );
}

MobileNavmenu.propTypes = {
  logoutMutation: propTypes.func,
};

export default MobileNavmenu;
