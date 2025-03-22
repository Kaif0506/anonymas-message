import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

const MessageForm = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("You have to write something!");
      setIsError(true);
      setResponseMsg("You have to write something...");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://anonymas-message.onrender.com/api/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, content: message }),
        }
      );

      if (!response.ok) {
        toast.error("Failed to send message");
        setIsError(true);
        setResponseMsg("Failed to send message.");
        setLoading(false);
        return;
      }

      toast.success("Your message has been sent successfully!");
      setMessage("");
      setResponseMsg("");
      setIsError(false);
    } catch (error) {
      toast.error("Something went wrong, please try again.");
      setIsError(true);
      setResponseMsg("Failed to send message.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-r from-pink-500 to-purple-600">
      <div className="bg-white shadow-2xl rounded-2xl p-7 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          ✨ Send an Anonymous Message ✨
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Write your message below and send it anonymously!
        </p>

        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition resize-none shadow-sm text-sm sm:text-base"
        />

        <button
          className={`mt-5 w-full text-white font-semibold py-3 rounded-xl shadow-md transition-transform transform hover:scale-105 sm:text-lg cursor-pointer ${
            loading
              ? "bg-pink-500/50 cursor-not-allowed opacity-50"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
          disabled={loading}
          onClick={sendMessage}
        >
          {loading ? (
            <div className="flex gap-3 justify-center items-center">
              <PulseLoader color="#fff" margin={2} size={8} />
              <p className="text-gray-200 text-sm sm:text-base">Sending...</p>
            </div>
          ) : (
            "Send Message"
          )}
        </button>

        {responseMsg && (
          <p className={`mt-3 text-sm sm:text-base font-medium ${isError ? "text-red-600" : "text-green-600"}`}>
            {responseMsg}
          </p>
        )}

        <div className="text-center text-gray-700 mt-5 text-sm sm:text-base">
          Want to create your own anonymous message link?
          <Link to="/" className="text-pink-600 font-semibold hover:underline ml-1">
            Click here!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
