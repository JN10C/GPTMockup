import React, { useState } from 'react';
import '../css/ChatInput.css';

// ChatInput component to type in a new question and send it
function ChatInput({ onSubmit }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(question);
    setQuestion('');
  };

  return (
    <div className="ChatInput">
      <form onSubmit={handleSubmit}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatInput;