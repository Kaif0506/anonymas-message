import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


const MessageForm = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false); // Track error state

  // Function to send message
  const sendMessage = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/send", {
        method: "POST", // FIXED: POST should be a string
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, content: message }),
      });

      if (!response.ok) {
        setResponseMsg("You have to write something...");
        toast.error("You have to write something");
        setIsError(true); // Set error state
        return;
      }

      const data = await response.json();
      
      toast.success("Your message has been sent");
      setIsError(false); // Reset error state
      setMessage(""); // Clear textarea after sending

    } catch (error) {
      setResponseMsg("Failed to send message.");
      setIsError(true); // Set error state
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-purple-600 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Send an Anonymous Message
        </h1>
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-none"
        />
        <button
          onClick={sendMessage}
          className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
        >
          Send
        </button>

        {responseMsg && (
          <p
            className={`mt-3 text-sm font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {responseMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageForm;
