/*

import React, { useState } from 'react';
import '../css/ChatApp.css';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ChatSidebar from './Sidebar';

// Main ChatApp component that keeps track of state and passes props to child components
function ChatApp() {
  // Mocked initial conversation
  const [conversations, setConversations] = useState([
    {
      title: 'Chat 1',
      chatHistory: [{ type: 'question', text: 'Hello GPT-3' }, { type: 'answer', text: 'Hello Human' }],
    },
  ]);

  const [currentConvIndex, setCurrentConvIndex] = useState(0);

  const submitQuestion = async (question) => {
    // Use the actual conversation id, not the index
    const conversationId = conversations[currentConvIndex].id;
    
    // Mocked API response
    setTimeout(async () => {
      const response = await fetch(`http://localhost:5000/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: question })
      });
  
      if (!response.ok) {
        console.error(`Error: ${response.status}`);
        return;
      }
  
      const updatedConversation = await response.json();
      
      setConversations(prevConversations =>
        prevConversations.map((conversation) =>
          conversation.id === conversationId ? updatedConversation : conversation
        )
      );
    }, 500);
  };

  const startNewChat = async () => {
    const response = await fetch('http://localhost:5000/conversations/new', { method: 'POST' });
    const newConversation = await response.json();
    
    setConversations((prevConversations) => [
      ...prevConversations,
      newConversation
    ]);
    setCurrentConvIndex(conversations.length);  // the index of the new conversation in the array
  };
  
  const selectConversation = (index) => {
    setCurrentConvIndex(index);
  };

  return (
    <div className="ChatApp">
      <ChatSidebar
        conversations={conversations}
        startNewChat={startNewChat}
        selectConversation={selectConversation}
      />
      <ChatWindow conversation={conversations[currentConvIndex]} />
      <ChatInput onSubmit={submitQuestion} />
    </div>
  );
}

export default ChatApp;

*/









import React, { useState, useEffect } from 'react';
import '../css/ChatApp.css';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ChatSidebar from './Sidebar';

// Main ChatApp component that keeps track of state and passes props to child components
function ChatApp() {
  const [conversations, setConversations] = useState([]);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch('http://localhost:5000/conversations');
      const data = await response.json();
      setConversations(data);
    };

    fetchConversations();
  }, []);

  const submitQuestion = async (question) => {
    try {
        const response = await fetch(`http://localhost:5000/conversations/${conversations[currentConvIndex].id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedConversation = await response.json();

        setConversations((prevConversations) => {
          return prevConversations.map((conv, index) =>
            index === currentConvIndex ? updatedConversation : conv
          );
        });
    } catch (error) {
        console.error('An error occurred while sending the message:', error);
    }
};

  const startNewChat = async () => {
    const response = await fetch('http://localhost:5000/conversations/new', { method: 'POST' });
    const newConversation = await response.json();

    setConversations((prevConversations) => [
      ...prevConversations,
      newConversation,
    ]);
    setCurrentConvIndex(conversations.length); // the index of the new conversation in the array
};

  const selectConversation = (index) => {
    setCurrentConvIndex(index);
  };

  return (
    <div className="ChatApp">
      <ChatSidebar
        conversations={conversations}
        startNewChat={startNewChat}
        selectConversation={selectConversation}
      />
      {conversations.length > 0 && (
        <div>
          <ChatWindow conversation={conversations[currentConvIndex]} />
          <ChatInput onSubmit={submitQuestion} />
        </div>
      )}
    </div>
  );
}

export default ChatApp;