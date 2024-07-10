import { ConversationContext } from '@/context/ConversationProvider';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function ConversationsNavbar() {
  const { chatState } = useContext(ConversationContext);

  return (
    <div className="h-full flex-1 max-w-[440px] border-r-2 border-gray-600 p-1 px-3">
      <h4 className="text-lg font-medium">Inbox</h4>
      <div className="flex flex-col">
        {chatState.conversations.size > 0
          ? Array.from(chatState.conversations).map(
              ([conversationId, conversation]) => (
                <Link
                  to={`./${conversationId}`}
                  key={conversationId}
                  className="w-full p-4 bg-gray-500"
                >
                  {conversationId}
                </Link>
              )
            )
          : ''}
      </div>
    </div>
  );
}

export default ConversationsNavbar;
