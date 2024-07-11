import { Button, Textarea } from '@material-tailwind/react';
import { SentIcon } from 'hugeicons-react';
import { useState } from 'react';
import PropTypes from 'prop-types';

function ChatFooter({ sendMessage }) {
  const [message, setMessage] = useState('');

  const onSend = () => {
    if (message !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full mt-auto flex items-start gap-2 px-4 py-3 border-t-2 border-gray-300">
      <Textarea
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        label="Message"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            setMessage(message + '\n');
          }
        }}
        className="!text-sm min-h-[60px] h-max !rounded-[6px]"
      />
      <Button
        size="sm"
        onClick={onSend}
        className="flex items-center gap-1 text-sm !rounded-[6px] bg-dark-blue !min-w-max"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        tabIndex={0}
      >
        <SentIcon size={20} /> Send
      </Button>
    </div>
  );
}

ChatFooter.propTypes = {
  sendMessage: PropTypes.func,
};

export default ChatFooter;
