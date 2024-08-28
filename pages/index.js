import { useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

export default function Home() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return; // Don't send empty queries

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery: query }),
      });

      const data = await response.json();
      const aiReply = data.aiReply || 'No response available.';
      setChatHistory((prev) => [
        ...prev,
        { sender: 'user', message: query },
        { sender: 'ai', message: aiReply },
      ]);
      setQuery('');
    } catch (error) {
      console.error('Error querying API:', error);
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    setQuery('');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Rate My Professor Assistant</h1>
      </header>

      <div className="chat-container">
        <div className="chat-box">
          <div className="chat-messages">
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={`chat-message ${entry.sender}`}
              >
                {entry.message}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query"
            className="chat-input"
          />
          <FaTimes
            onClick={handleClear}
            className="chat-icon clear-icon"
            title="Clear All"
          />
          <FaPaperPlane
            onClick={handleSearch}
            className="chat-icon send-icon"
            title="Send"
          />
        </div>
      </div>
    </div>
  );
}
