import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import DOMPurify from "dompurify"; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageLink, setMessageLink] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const success = localStorage.getItem("success");

  useEffect(() => {
    if (success) {
      toast.success(success);
      localStorage.removeItem("success");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const link = localStorage.getItem("messageLink");
    if (link) {
      try {
        const storedUrl = new URL(link);
        const currentUrl = new URL(window.location.href);

        if (storedUrl.hostname !== currentUrl.hostname) {
          const newLink = `${currentUrl.origin}/user/${storedUrl.pathname.split('/').pop()}`;
          localStorage.setItem("messageLink", newLink);
          setMessageLink(newLink);
        } else {
          setMessageLink(link);
        }
      } catch (error) {
        console.error("Error parsing URL:", error);
        setMessageLink(link);
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("https://anonymas-message.onrender.com/api/user", {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://anonymas-message.onrender.com/api/messages`, {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    setCopied(false);
    fetchUserData();
    fetchMessages();
  }, [navigate]);

  const handleDeleteMessage = async (messageId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`https://anonymas-message.onrender.com/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        toast.error("Error deleting message.");
        return;
      }

      toast.success("Message deleted successfully.");
      const refreshMessages = async () => {
        try {
          const response = await fetch(`https://anonymas-message.onrender.com/api/messages`, {
            headers: { Authorization: token },
          });
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      refreshMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageLink);
    setCopied(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl transform transition duration-300 hover:scale-100">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
          Welcome to Your Dashboard
        </h1>

        {user ? (
          <div className="mt-4 text-gray-700 space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-lg"><strong>Name:</strong> {user.username}</p>
              <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">Messages</h2>

            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className="bg-blue-100 p-5 rounded-lg shadow-sm border-l-4  border-blue-500 relative "
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(msg.decryptedMessage),
                      }}
                    />

                    <button
                      className="absolute right-3 top-[10px] cursor-pointer"
                      onClick={() => handleDeleteMessage(msg._id)}
                    >
                      <MdDeleteForever className="text-[24px] text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {messageLink && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-700 text-sm mb-2 font-[500]">
                  Your Link — share it with your friends:
                </p>
                <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-2">
                  <input
                    type="text"
                    value={messageLink}
                    readOnly
                    className="w-full text-sm text-gray-800 outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded-lg transition"
                  >
                    Copy
                  </button>
                </div>
                {copied && (
                  <p className="text-green-600 text-sm mt-2">Link copied!</p>
                )}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="loader flex justify-center">
            <PulseLoader color="#2cc18a" margin={2} size={10} speedMultiplier={1} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
