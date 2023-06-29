import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../css/UsageWindow.css'; // create this CSS file to style your usage window

const UsageWindow = () => {
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('messageAdded', (updatedConversation) => {
      const lastMessage = updatedConversation.chatHistory[updatedConversation.chatHistory.length - 1];
      if (lastMessage.user === 'GPT-3') {
        setTotalTokens(prevTokens => prevTokens + lastMessage.tokenUsage);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="UsageWindow">
      <p>Total tokens used: {totalTokens}</p>
    </div>
  );
}

export default UsageWindow;