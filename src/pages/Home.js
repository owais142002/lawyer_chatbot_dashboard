import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchNamespaces } from '../api';
import { API_BASE_URL } from "../apiConfig";

const API_BASE_URL_LAWYER = `${API_BASE_URL}/chatbot/lawyer`;

function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNamespaces()
      .then(response => {
        const namespaces = response.data.namespaces;
        setCountries(namespaces);
      })
      .catch(err => console.error('Error fetching countries:', err));

    getChatHistory();
  }, []);

  const getChatHistory = () => {
    const token = localStorage.getItem('access_token');
    axios
      .get(`${API_BASE_URL_LAWYER}/get-chat-history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setChatHistory(response.data.chatHistory);
      })
      .catch(err => {
        console.error('Error fetching chat history:', err);
      });
  };

  const handleSendQuery = async () => {
    if (!query || !selectedCountry) {
      alert('Please select a country and enter a query');
      return;
    }
  
    setLoading(true);
    const token = localStorage.getItem('access_token');
  
    try {
      const response = await fetch(`${API_BASE_URL_LAWYER}/query/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, country: selectedCountry }),
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialMessage = ''; // This will hold the accumulating AI response
  
      // Push user's query to chatHistory immediately
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'human', content: query },
      ]);
  
      // Add an initial empty entry for the AI response to update progressively
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'ai', content: '' },
      ]);
  
      let doneReading = false;
      while (!doneReading) {
        const { done, value } = await reader.read();
        doneReading = done;
  
        // Decode the received chunk
        const chunk = decoder.decode(value, { stream: true });
        partialMessage += chunk; // Accumulate the streamed content
  
        // Update the AI message in the chat as the stream progresses
        setChatHistory((prevChatHistory) => {
          // Ensure we're only updating the last AI response entry
          const updatedChat = [...prevChatHistory];
          const lastIndex = updatedChat.length - 1;
  
          if (updatedChat[lastIndex]?.type === 'ai') {
            // Replace the last AI response with the updated message
            updatedChat[lastIndex].content = partialMessage;
          }
  
          return updatedChat;
        });
      }
    } catch (error) {
      console.error('Error sending query:', error);
    } finally {
      setQuery('');
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    const token = localStorage.getItem('access_token');
    axios
      .get(`${API_BASE_URL_LAWYER}/clear-chat-history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setChatHistory([]);
      })
      .catch(err => {
        console.error('Error clearing chat history:', err);
      });
  };

  return (
    <div className="p-8 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat with Rehani's Hani AI</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={handleClearChat}
        >
          Clear Chat
        </button>
      </div>

      <div className="mb-6">
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow bg-gray-100 p-4 rounded-lg mb-6 max-h-96 overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg max-w-lg ${
              chat.type === 'human' ? 'bg-blue-200 ml-auto' : 'bg-green-200 mr-auto'
            }`}
          >
            <p>{chat.content}</p>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">Loading...</div>}
      </div>

      <div className="flex mb-4">
        <input
          className="border p-2 rounded-lg flex-grow mr-2"
          placeholder="Type your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSendQuery}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Home;
