import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://anonymas-message.onrender.com/api/messages`,{
          method: 'GET',
          headers:{
            Authorization: token,
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Messages</h1>

        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="bg-gray-100 p-3 rounded-lg shadow-sm text-gray-800 border-l-4 border-blue-500"
              >
                {msg.decryptedMessage}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
