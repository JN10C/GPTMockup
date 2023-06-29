/*
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');



const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Store conversations on the server for now

console.log(process.env.OPENAI_API_KEY);

let conversations = [
  { id: 1, title: 'Chat 1', chatHistory: [] },
  { id: 2, title: 'Chat 2', chatHistory: [] },
];

app.get('/conversations', (req, res) => {
  res.json(conversations);
});

app.post('/conversations/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const conversation = conversations.find(conv => conv.id === Number(id));

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  conversation.chatHistory.push({ user: 'User', message });

  // Call the OpenAI API here
  console.log(message);

  try {
    // Call the OpenAI API here
const gpt3Response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo', // Replace with the model you intend to use
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: message
      }
    ]
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });
  
  const gpt3Message = gpt3Response.data.choices[0].message.content;
  
  conversation.chatHistory.push({ user: 'GPT-3', message: gpt3Message });
  } catch (error) {
    console.error('An error occurred while making a request to OpenAI API:',error.response.data);
    return res.status(500).json({ error: 'An error occurred while generating the response.' });
  }

  res.json(conversation);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body

let idCounter = 2;  // as we start with 2 conversations, id 1 and 2

let conversations = [
  { id: 1, title: 'Chat 1', chatHistory: [] },
  { id: 2, title: 'Chat 2', chatHistory: [] },
];

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
});

app.get('/conversations', (req, res) => {
  res.json(conversations);
});

app.post('/conversations/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  let conversation = conversations.find(conv => conv.id === Number(id));

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  conversation.chatHistory.push({ user: 'User', message });

  try {
    let messagesForAPI = conversation.chatHistory.map(msg => ({
      role: msg.user === 'User' ? 'user' : 'assistant',
      content: msg.message
    }));

    messagesForAPI.unshift({
      role: 'system',
      content: 'You are a helpful assistant.'
    });

    let totalTokens = messagesForAPI.reduce((total, msg) => total + msg.content.length, 0);
    const maxTokens = 4096;

    while (totalTokens > maxTokens) {
      const removedMessage = messagesForAPI.splice(2, 1)[0];
      totalTokens -= removedMessage.content.length;
    }

    const gpt3Response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo', 
      messages: messagesForAPI
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
  
    const gpt3Message = gpt3Response.data.choices[0].message.content;
    const tokenUsage = gpt3Response.data.usage.total_tokens; // Getting token usage

    conversation.chatHistory.push({ user: 'GPT-3', message: gpt3Message, tokenUsage });

    conversation = { ...conversation };

    conversations = conversations.map(conv => conv.id === conversation.id ? conversation : conv);

    io.emit('messageAdded', conversation);

    res.json(conversation);
  } catch (error) {
    console.error('An error occurred while making a request to OpenAI API:', error.response.data);
    return res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
});

app.post('/conversations/new', (req, res) => {
    idCounter++;  // increment the counter
    const newConversation = { id: idCounter, title: `Chat ${idCounter}`, chatHistory: [] };
    conversations.push(newConversation);
    res.json(newConversation);
  });
  


const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});