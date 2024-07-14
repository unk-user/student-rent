import { ConversationContext } from '@/context/ConversationProvider';
import { useContext } from 'react';
import ConversationNavitem from './ConversationNavitem';
import { Message01Icon } from 'hugeicons-react';

function ConversationsNavbar() {
  const { chatState } = useContext(ConversationContext);

  return (
    <div className="h-full flex-1 max-w-[440px] max-md:max-w-none max-md:border-r-0 border-r pr-1 border-gray-600">
      <div className="flex flex-col gap-2 py-2 overflow-y-auto h-full">
        {chatState.conversations.size > 0 ? (
          Array.from(chatState.conversations).map(
            ([conversationId, conversation]) => (
              <ConversationNavitem
                key={conversationId}
                conversation={conversation}
              />
            )
          )
        ) : (
          <div className='self-center text-center mt-12'>
            <Message01Icon size={32} className='mx-auto mb-4'/>
            <h4 className='text-lg'>You don&apos;t have any messages yet</h4>
            <p className='text-base text-gray-600'>When you recieve messages it will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationsNavbar;
