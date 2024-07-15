import {
  Badge,
  Button,
  Menu,
  MenuHandler,
  MenuList,
} from '@material-tailwind/react';
import { Logout01Icon, Message02Icon } from 'hugeicons-react';
import { NavLink } from 'react-router-dom';
import propTypes from 'prop-types';
import { AuthContext } from '@/context/AuthProvider';
import { useContext } from 'react';
import { ConversationContext } from '@/context/ConversationProvider';
import profileSvg from '@/assets/blank-profile-picture-973460.svg';

function NavIcons({ logoutMutation }) {
  const { auth } = useContext(AuthContext);
  const { chatState, onlineState } = useContext(ConversationContext);

  const messageAvailable = chatState?.conversations
    ? Array.from(chatState?.conversations?.values()).some((conversation) => {
        return conversation?.newMessagesCount[0]?.count > 0;
      })
    : false;

  return (
    <div className="ml-auto flex items-center gap-3">
      <NavLink
        to="/tenant/messages"
        className={({ isActive }) =>
          [
            isActive ? 'text-blue-300' : 'text-dark-blue',
            'transition-colors duration-200 h-[28px]',
          ].join(' ')
        }
      >
        <Badge
          placement="top-end"
          color="blue"
          overlap="circular"
          invisible={!messageAvailable}
          withBorder
        >
          <Message02Icon size={28}/>
        </Badge>
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
            className="!w-full flex !justify-start items-center gap-2"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <Logout01Icon />
            Logout
          </Button>
        </MenuList>
      </Menu>
    </div>
  );
}

NavIcons.propTypes = {
  logoutMutation: propTypes.func,
};

export default NavIcons;
