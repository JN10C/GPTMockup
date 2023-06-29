import React from 'react';
import '../css/Message.css';

const Message = ({ message }) => {
  const isUser = message.user === 'User';

  return (
    <div className={`Message ${isUser ? 'Message--user' : 'Message--gpt'}`}>
      <div className={`Message-bubble ${isUser ? 'Message-bubble--user' : 'Message-bubble--gpt'}`}>
        {message.message}
      </div>
    </div>
  );
}

export default Message;