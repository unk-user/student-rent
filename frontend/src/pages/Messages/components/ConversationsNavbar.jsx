import { ConversationContext } from '@/context/ConversationProvider';
import { useContext } from 'react';
import ConversationNavitem from './ConversationNavitem';

function ConversationsNavbar() {
  const { chatState } = useContext(ConversationContext);

  return (
    <div className="h-full flex-1 max-w-[440px] border-r-2 border-gray-600">
      <h4 className="text-lg font-medium px-2 h-14 border-b-2 border-gray-300">Inbox</h4>
      <div className="flex flex-col mt-2">
        {chatState.conversations.size > 0
          ? Array.from(chatState.conversations).map(
              ([conversationId, conversation]) => (
                <ConversationNavitem
                  key={conversationId}
                  conversation={conversation}
                />
              )
            )
          : ''}
      </div>
    </div>
  );
}

export default ConversationsNavbar;
