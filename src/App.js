import React, { useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const res = await fetch('http://localhost:5000/chat', {  // Cambia esto a la URL donde se despliegue Flask
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setChatLog([...chatLog, { user: message, bot: data.response }]);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="App">
      <h1>AnarcoGPT</h1>
      <div className="chat-container">
        <div className="chat-log">
          {chatLog.map((entry, index) => (
            <div key={index} className="chat-message">
              <p className="user-message">{entry.user}</p>
              <p className="bot-message">{entry.bot}</p>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyPress={handleKeyPress} 
            placeholder="Talk to Rothbard..."
            className="chat-input"
          />
          <button onClick={sendMessage} className="chat-send-button">
            <FaTelegramPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
