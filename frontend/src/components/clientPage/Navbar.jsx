import { HiOutlineSquares2X2, HiOutlineBookmark, HiOutlineChatBubbleBottomCenterText, HiOutlineUserCircle } from "react-icons/hi2";
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 w-screen h-[68px] bg-zinc-950 text-gray-500">
      <nav className="flex h-full py-2 max-w-80 items-center justify-between mx-auto">
        <NavLink className="flex flex-col items-center relative pb-4">
          <HiOutlineSquares2X2 className="w-[35px] h-[35px]" />
          <p className="text-sm absolute bottom-0">Explore</p>
        </NavLink>
        <NavLink className="flex flex-col items-center relative pb-4">
          <HiOutlineBookmark className="w-[35px] h-[35px]" />
          <p className="text-sm absolute bottom-0">Bookmarks</p>
        </NavLink>
        <NavLink className="flex flex-col items-center relative pb-4">
          <HiOutlineChatBubbleBottomCenterText className="w-[35px] h-[35px]" />
          <p className="text-sm absolute bottom-0">Inbox</p>
        </NavLink>
        <NavLink className="flex flex-col items-center relative pb-4">
          <HiOutlineUserCircle className="w-[35px] h-[35px]" />
          <p className="text-sm absolute bottom-0">Profile</p>
        </NavLink>
      </nav>
    </div>
  );
}

export default Navbar;
