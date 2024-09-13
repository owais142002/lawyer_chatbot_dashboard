import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchNamespaces } from '../api';

const API_BASE_URL =  "https://render-dev-ke.rehanisoko-internal.com/api/v1/chatbot/lawyer";
const BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4MTU5MTM1LCJpYXQiOjE3MjU1NjcxMzUsImp0aSI6ImU3NDRmYzlkZjE2ZjRjMGI4NzI0YjRhZGFmOWYwMzljIiwidXNlcl9pZCI6M30.zKHji53kH1WyNrPz8kzvaaSfeAG_CagRsAJxX9Lvggw';

function Home() {
  const [countries, setCountries] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch namespaces on page load
  useEffect(() => {
    fetchNamespaces()
      .then(response => {
        const data = response.data.data;
        setCountries(Object.keys(data));
      })
      .catch(err => console.error('Error fetching countries:', err));

    // Fetch chat history
    getChatHistory();
  }, []);

  // Fetch namespaces when country is selected
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedNamespace('');
    if (country) {
      fetchNamespaces()
        .then(response => {
          setNamespaces(response.data.data[country] || []);
        })
        .catch(err => console.error('Error fetching namespaces:', err));
    }
  };

  // Fetch chat history
  const getChatHistory = () => {
    axios
      .get(`${API_BASE_URL}/get-chat-history/`, {
        headers: {
          Authorization: BEARER_TOKEN,
        },
      })
      .then(response => {
        setChatHistory(response.data.chatHistory);
      })
      .catch(err => {
        console.error('Error fetching chat history:', err);
      });
  };

  // Handle sending the query
  const handleSendQuery = () => {
    if (!query || !selectedCountry || !selectedNamespace) {
      alert('Please select country, namespace, and enter a query');
      return;
    }

    setLoading(true);
    axios
      .post(
        `${API_BASE_URL}/query/`,
        { query, country: selectedCountry, namespace: selectedNamespace },
        {
          headers: {
            Authorization: BEARER_TOKEN,
          },
        }
      )
      .then(response => {
        setChatHistory([
          ...chatHistory,
          { type: 'human', content: query },
          { type: 'ai', content: response.data.result },
        ]);
        setQuery('');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error sending query:', err);
        setLoading(false);
      });
  };

  // Handle clearing chat history
  const handleClearChat = () => {
    axios
      .get(`${API_BASE_URL}/clear-chat-history/`, {
        headers: {
          Authorization: BEARER_TOKEN,
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
        <h1 className="text-2xl font-bold">Chat with Legal AI</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={handleClearChat}
        >
          Clear Chat
        </button>
      </div>

      {/* Dropdowns for Country and Namespace */}
      <div className="mb-6">
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedNamespace}
          onChange={(e) => setSelectedNamespace(e.target.value)}
          disabled={!selectedCountry}
        >
          <option value="">Select Namespace</option>
          {namespaces.map(namespace => (
            <option key={namespace} value={namespace}>
              {namespace}
            </option>
          ))}
        </select>
      </div>

      {/* Chat History */}
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

      {/* Query Input */}
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
