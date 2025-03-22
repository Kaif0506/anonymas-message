import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";



const Home = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageLink, setMessageLink] = useState("");
  const [userId, setUserId] = useState(""); 
  const [loading, setLoading] = useState(false);

  
  const navigate = useNavigate();

  // Generate link API call
  const generateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://anonymas-message.onrender.com/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username,email,password}),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }
      if (data.token) {
        localStorage.setItem("token", data.token); // Store token
        navigate('/dashboard');
      }
      if(data.link){
        localStorage.setItem("messageLink", data.link);
      }
      
      const unique = (data.uniqueId); 
      setUserId(unique)
      setMessageLink(data.link);
      setCopied(false); 
      setLoading(false);

    } catch (error) {
      setLoading(false);
      toast.error("error");
      

    }
    setLoading(false);
  };

  

 

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Generate Your Anonymous Message Link
        </h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-3"
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-3"
        />
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-3"
        />
        <div className="text-center text-gray-600">
            Already have an account? <Link to={"/login"} className="text-blue-500 ">Login</Link>
          </div>
        <button
            className={`w-full  text-white font-semibold py-2 rounded-lg mt-3 shadow-md transition-transform transform hover:scale-105  cursor-pointer ${
              loading
                ? "bg-blue-500/50 cursor-not-allowed opacity-50"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={loading}
            onClick={generateLink}
          >
            {loading ? (
              <div className="flex gap-5 justify-center items-center">
                <PulseLoader
                  color="#fff"
                  margin={2}
                  size={10}
                  speedMultiplier={1}
                />

                <p className="text-gray-600 text-sm">Registering...</p>
              </div>
            ) : (
              "Register"
            )}
          </button>
        
        
      </div>
    </div>
  );
};

export default Home;