import React, { useState, useEffect, useRef } from 'react';
import '../css/ChatWindow.css';
import Message from './Message';

const ChatWindow = ({ conversation, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  useEffect(() => {
    console.log('ChatWindow rendered!');
    console.log(conversation);
  });

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (newMessage.trim() !== '') {
      onNewMessage(newMessage, conversation);
      setNewMessage('');
    }
  };

  return (
    <div className="ChatWindow">
      {conversation ? (
        <>
          <div className="ChatWindow-title">
            {conversation.title}
          </div>
          <div className="ChatWindow-messages">
            {conversation.chatHistory && conversation.chatHistory.slice().reverse().map((message, index) => (
              <Message key={index} message={message} />
            ))}
            <div ref={bottomRef}></div>
          </div>
          <form className="ChatWindow-input-form" onSubmit={handleFormSubmit}>
            <input 
              className="ChatWindow-input"
              type="text"
              value={newMessage}
              onChange={handleInputChange}
            />
          </form>
        </>
      ) : (
        <div>Select a conversation to start chatting.</div>
      )}
    </div>
  );
}

export default ChatWindow;