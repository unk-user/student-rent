import { Button, Textarea } from '@material-tailwind/react';
import { SentIcon } from 'hugeicons-react';
import { useState } from 'react';
import PropTypes from 'prop-types';

function ChatFooter({ sendMessages }) {
  const [message, setMessages] = useState('');

  const onSend = () => {
    if (message !== '') {
      sendMessages(message);
      setMessages('');
    }
  };

  return (
    <div className="w-full mt-auto flex items-start gap-2 px-4 py-3 border-t-2 border-gray-300">
      <Textarea
        variant="outlined"
        value={message}
        onChange={(e) => setMessages(e.target.value)}
        label="Message"
        className="!text-sm min-h-[60px] h-max !rounded-[6px]"
      />
      <Button
        size="sm"
        onClick={onSend}
        className="flex items-center gap-1 text-sm !rounded-[6px] bg-dark-blue"
      >
        <SentIcon size={24} /> Send
      </Button>
    </div>
  );
}

ChatFooter.propTypes = {
  sendMessages: PropTypes.func,
};

export default ChatFooter;
