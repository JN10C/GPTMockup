import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './css/App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import UsageWindow from './components/UsageWindow';

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [ setCurrentConvIndex] = useState(0);


  useEffect(() => {
    const socket = io('http://localhost:5000');

    const fetchConversations = async () => {
      const response = await fetch('http://localhost:5000/conversations');
      const data = await response.json();
      setConversations(data);
      setSelectedConversation(data[0]);
    };
    
    fetchConversations();

    socket.on('messageAdded', (updatedConversation) => {
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.id === updatedConversation.id ? updatedConversation : conversation
        )
      );

      // If the updated conversation is the currently selected one, also update selectedConversation
      if (selectedConversation && selectedConversation.id === updatedConversation.id) {
        setSelectedConversation(updatedConversation);
      }
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency array

useEffect(() => {
  setSelectedConversation(prevSelectedConversation => {
    if (prevSelectedConversation) {
      const updatedSelectedConversation = conversations.find(conversation => 
        prevSelectedConversation.id === conversation.id
      );

      if (updatedSelectedConversation) {
        return updatedSelectedConversation;
      }
    }
    return prevSelectedConversation;
  });
}, [conversations]);

const startNewChat = async () => {
  const response = await fetch('http://localhost:5000/conversations/new', { method: 'POST' });
  const newConversation = await response.json();

  setConversations((prevConversations) => [
    ...prevConversations,
    newConversation,
  ]);
  setCurrentConvIndex(conversations.length); // the index of the new conversation in the array
};

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewMessage = (newMessage, conversation) => {
    fetch(`http://localhost:5000/conversations/${conversation.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: newMessage })
    })
      .then(response => response.json())
      .then(updatedConversation => {
        setConversations(prevConversations => prevConversations.map(conv =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        ));
      });
  };

  return (
    <div className="App">
      <Sidebar 
        conversations={conversations}
        onNewChat={startNewChat}
        onConversationSelected={selectConversation}
        selectedConversation={selectedConversation}
      />
      {selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          onNewMessage={handleNewMessage}
        />
      )}
      <UsageWindow />  
    </div>
  );
}

export default App;


