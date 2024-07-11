import { Outlet } from 'react-router-dom';
import ConversationsNavbar from './components/ConversationsNavbar';

function ChatLayout() {
  return (
    <div className="h-full w-full py-6 max-h-[calc(100vh-4rem)]">
      <div className="max-w-[1432px] mx-auto bg-white h-full min-h-[600px] flex">
        <ConversationsNavbar />
        <div className="flex-1 flex flex-col relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <h2 className="text-2xl">Open a conversation</h2>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ChatLayout;
