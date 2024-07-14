import { useOutlet } from 'react-router-dom';
import ConversationsNavbar from './components/ConversationsNavbar';
import { useMediaQuery } from 'react-responsive';

function ChatLayout() {
  const outlet = useOutlet();
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  return (
    <div className="h-[calc(100vh-3.4rem)] w-full py-6 max-xl:py-0 max-h-[calc(100vh-3.4rem)]">
      <div className="max-w-[1432px] h-full mx-auto bg-white flex">
        {isDesktop || !outlet ? <ConversationsNavbar /> : ''}
        {isDesktop || outlet ? (
          <div className="flex-1 flex flex-col relative max-md:px-4 max-sm:px-2">
            {outlet}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default ChatLayout;
