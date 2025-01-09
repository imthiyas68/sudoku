import React, { useState } from 'react';

const TeamChat = ({ messages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Team Chat</h3>
      <div className="chat-messages h-48 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message mb-2">
            <strong>{msg.userId}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TeamChat;