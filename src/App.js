import React, { useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const res = await fetch('https://anarcogpt.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      // Verificar el estado de la respuesta
      console.log('Response status:', res.status); // Imprimir el estado de la respuesta

      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }

      // Leer la respuesta como texto para verificar si es JSON válido
      const text = await res.text(); // Lee la respuesta como texto
      console.log('Response text:', text); // Imprimir el texto de la respuesta

      // Intentar convertir el texto a JSON
      const data = JSON.parse(text);

      // Verifica si 'data' tiene la estructura esperada
      if (data && data.response) {
        setChatLog([...chatLog, { user: message, bot: data.response }]);
      } else {
        console.error('Unexpected response structure:', data);
      }

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
